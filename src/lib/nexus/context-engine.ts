import { detectEntities, jaccard, tokenize } from "./entities.ts";
import { estimateTokens } from "./tokens.ts";
import type {
  Character,
  ChatMessage,
  ContextPack,
  DetectedEntities,
  LoreEntry,
  Memory,
  Persona,
  Relationship,
  Story,
  StoryState,
  TokenBudget,
  World,
} from "./types.ts";
import { DEFAULT_BUDGET } from "./types.ts";

export type ContextIndex = {
  story: Story;
  characters: Character[];
  persona?: Persona;
  world?: World;
  lore: LoreEntry[];
  memories: Memory[];
  relationships: Relationship[];
  storyState?: StoryState;
  transcript: ChatMessage[];
};

export function retrieveContext(
  index: ContextIndex,
  userText: string,
  budget: TokenBudget = DEFAULT_BUDGET,
): ContextPack {
  const entities = detectEntities(
    userText + " " + lastAssistant(index.transcript),
    index.characters,
    index.lore,
    index.world,
  );

  const storyChars = index.characters.filter((c) =>
    index.story.characterIds.includes(c.id),
  );
  const presentIds = index.storyState?.presentCharacterIds ?? [];
  const tracked =
    Boolean(index.storyState?.tracked) || presentIds.length > 0;
  const sceneIds = new Set(tracked ? presentIds : index.story.characterIds);
  const presentChars = index.characters.filter((c) => sceneIds.has(c.id));
  const mentionedPresent = index.characters.filter(
    (c) => entities.characters.some((e) => e.id === c.id) && sceneIds.has(c.id),
  );
  const mergedChars = uniqById([...presentChars, ...mentionedPresent]).slice(0, 8);
  const absentCharacters = tracked
    ? storyChars.filter((c) => !sceneIds.has(c.id))
    : [];

  const lore = activateLore(
    index.lore.filter((l) => l.enabled),
    entities,
    userText + " " + lastAssistant(index.transcript),
    index.story.loreActivation,
  );

  const pathIds = new Set(index.transcript.map((m) => m.id));
  const memories = index.story.memoryMatrix
    ? rankMemories(
        memoriesOnPath(
          index.memories.filter(
            (m) => m.storyId === index.story.id && m.status !== "deleted",
          ),
          pathIds,
        ),
        entities,
        userText,
        index.storyState,
      ).slice(0, 24)
    : [];

  const relationships = index.relationships.filter((r) => {
    if (r.storyId !== index.story.id) return false;
    const ids = new Set(mergedChars.map((c) => c.id));
    if (index.persona) ids.add(index.persona.id);
    return ids.has(r.aId) || ids.has(r.bId);
  });

  const chat = trimChat(index.transcript, budget.chat);

  return {
    characters: mergedChars,
    persona: index.persona,
    world: index.world,
    lore: fitList(lore, budget.lore, (l) => l.title + l.content),
    memories: fitList(memories, budget.memory, (m) => m.content),
    relationships,
    storyState: index.storyState,
    chat,
    entities,
    budget,
    absentCharacters,
  };
}

export function memoriesOnPath(memories: Memory[], pathIds: Set<string>): Memory[] {
  return memories.filter((m) => {
    if (m.pinned || m.manuallyEdited) return true;
    if (!m.sourceMessageId) return true;
    return pathIds.has(m.sourceMessageId);
  });
}

export function memoryProvenance(m: Memory): "canon" | "seen" | "guessed" {
  if (m.pinned || m.manuallyEdited) return "canon";
  if (m.observation && m.confidence >= 0.8) return "seen";
  return "guessed";
}

/** Always-on + keyword match, then 2 hops of ST-style recursion. */
export function activateLore(
  entries: LoreEntry[],
  entities: DetectedEntities,
  scanText: string,
  activation: Story["loreActivation"],
  depth = 2,
): LoreEntry[] {
  if (activation === "off") return [];
  const enabled = entries.filter((l) => l.enabled);
  if (activation === "all") return enabled;
  const always = enabled.filter((l) => l.always);
  const ranked = rankLore(
    enabled.filter((l) => !l.always),
    entities,
    scanText,
  );
  const seed = uniqById([...always, ...ranked]);
  return recurseLore(enabled, seed, scanText, depth).slice(0, 16);
}

export function recurseLore(
  all: LoreEntry[],
  activated: LoreEntry[],
  scanText: string,
  depth: number,
): LoreEntry[] {
  const seen = new Set(activated.map((e) => e.id));
  let current = [...activated];
  for (let d = 0; d < depth; d++) {
    const haystack = (
      scanText +
      "\n" +
      current.map((e) => `${e.title}\n${e.content}\n${e.keywords.join(" ")}`).join("\n")
    ).toLowerCase();
    const extra: LoreEntry[] = [];
    for (const entry of all) {
      if (seen.has(entry.id) || entry.preventRecursion) continue;
      const keys = [entry.title, ...entry.keywords, ...entry.aliases].filter(Boolean);
      if (keys.some((k) => k && haystack.includes(k.toLowerCase()))) {
        seen.add(entry.id);
        extra.push(entry);
      }
    }
    if (!extra.length) break;
    current = [...current, ...extra];
  }
  return current;
}

export function rankMemories(
  memories: Memory[],
  entities: DetectedEntities,
  userText: string,
  storyState?: StoryState,
): Memory[] {
  const queryTokens = tokenize(userText);
  const entityNames = new Set(
    [...entities.characters, ...entities.locations, ...entities.others].map((e) =>
      e.name.toLowerCase(),
    ),
  );
  const scored = memories.map((m) => {
    let score = m.importance * 40 + m.confidence * 10;
    if (m.pinned) score += 100;
    if (m.manuallyEdited) score += 20;
    const recency = Math.max(0, 1 - (Date.now() - m.createdAt) / (1000 * 60 * 60 * 24 * 21));
    score += recency * 20;
    const subjHit = m.subjects.some((s) => entityNames.has(s.toLowerCase()));
    if (subjHit) score += 30;
    score += jaccard(tokenize(m.content), queryTokens) * 24;
    if (storyState?.location && m.content.toLowerCase().includes(storyState.location.toLowerCase())) {
      score += 8;
    }
    return { m, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.m);
}

export function rankLore(
  lore: LoreEntry[],
  entities: DetectedEntities,
  userText: string,
): LoreEntry[] {
  const q = userText.toLowerCase();
  const qTokens = tokenize(userText);
  const names = new Set(
    [...entities.characters, ...entities.locations, ...entities.others].map((e) =>
      e.name.toLowerCase(),
    ),
  );
  const scored = lore.map((l) => {
    let score = 0;
    const keys = [l.title, ...l.keywords, ...l.aliases];
    for (const k of keys) {
      if (!k) continue;
      if (q.includes(k.toLowerCase()) || names.has(k.toLowerCase())) score += 28;
    }
    score += jaccard(tokenize(l.content), qTokens) * 18;
    if (score > 0) score += l.priority * 10 + l.importance * 20;
    return { l, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score >= 20).map((s) => s.l);
}

function trimChat(messages: ChatMessage[], budgetTokens: number): ChatMessage[] {
  const kept: ChatMessage[] = [];
  let used = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const t = estimateTokens(messages[i].content);
    if (used + t > budgetTokens && kept.length > 2) break;
    kept.push(messages[i]);
    used += t;
  }
  return kept.reverse();
}

function fitList<T>(items: T[], budget: number, text: (item: T) => string): T[] {
  const out: T[] = [];
  let used = 0;
  for (const item of items) {
    const t = estimateTokens(text(item));
    if (used + t > budget && out.length > 0) break;
    out.push(item);
    used += t;
  }
  return out;
}

function lastAssistant(transcript: ChatMessage[]): string {
  for (let i = transcript.length - 1; i >= 0; i--) {
    if (transcript[i].role === "assistant") return transcript[i].content;
  }
  return "";
}

function uniqById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}
