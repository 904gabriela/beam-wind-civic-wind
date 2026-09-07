import { detectEntities, jaccard, normalizeLine, tokenize } from "./entities.ts";
import { nid, now } from "./ids.ts";
import type {
  AnalyzerMemory,
  AnalyzerOutput,
  Character,
  LoreEntry,
  Memory,
  MemoryType,
  Relationship,
  StoryState,
  World,
} from "./types.ts";

const PATTERNS: {
  re: RegExp;
  type: MemoryType;
  importance: number;
  rel: number;
  emotion: number;
}[] = [
  { re: /\b(kissed|kiss)\b/i, type: "relationship_event", importance: 0.92, rel: 0.94, emotion: 0.9 },
  { re: /\b(promised|promise|vowed|swore)\b/i, type: "promise", importance: 0.9, rel: 0.72, emotion: 0.55 },
  { re: /\b(secret|never told|don't tell|dont tell)\b/i, type: "secret", importance: 0.93, rel: 0.8, emotion: 0.7 },
  { re: /\b(argued|argument|yelled|fought|fight)\b/i, type: "conflict", importance: 0.78, rel: 0.74, emotion: 0.7 },
  { re: /\b(apologized|apology|forgave|reconciled)\b/i, type: "relationship_event", importance: 0.82, rel: 0.8, emotion: 0.66 },
  { re: /\b(confess(?:ed|es|ion)?)\b/i, type: "relationship_event", importance: 0.88, rel: 0.86, emotion: 0.8 },
  { re: /\b(moved to|permanently|will live|left (?:town|home|the city))\b/i, type: "fact", importance: 0.84, rel: 0.3, emotion: 0.4 },
  { re: /\b(died|killed|wounded|injured)\b/i, type: "event", importance: 0.95, rel: 0.5, emotion: 0.85 },
  { re: /\b(arrived|returned to|went back|took .+ (?:to|into))\b/i, type: "event", importance: 0.55, rel: 0.2, emotion: 0.2 },
  { re: /\b(goal|must|have to protect|will protect)\b/i, type: "goal", importance: 0.72, rel: 0.4, emotion: 0.35 },
  { re: /\b(found|discovered|realized)\b/i, type: "discovery", importance: 0.7, rel: 0.25, emotion: 0.35 },
];

const TRIVIAL = /\b(dropped (?:her |his |their )?(?:phone|bag|keys)|yawned|blinked|sipped|shifted in (?:her |his )?seat)\b/i;

export function scoreConfidence(opts: {
  observation: boolean;
  explicit: boolean;
  inferred: boolean;
}): number {
  if (opts.inferred && !opts.explicit) return 0.38;
  if (opts.observation && opts.explicit) return 0.96;
  if (opts.explicit) return 0.86;
  if (opts.observation) return 0.74;
  return 0.5;
}

export function shouldAutoCommit(confidence: number, importance: number): "committed" | "soft" | "reject" {
  if (confidence < 0.55 || importance < 0.45) return "reject";
  if (confidence < 0.8) return "soft";
  return "committed";
}

export function extractHeuristic(opts: {
  storyId: string;
  chatId: string;
  sourceMessageId: string;
  userText: string;
  assistantText: string;
  characters: Character[];
  lore?: LoreEntry[];
  world?: World;
}): AnalyzerOutput {
  const text = `${opts.userText}\n${opts.assistantText}`.trim();
  if (!text) return emptyAnalyzer();

  if (TRIVIAL.test(text) && text.length < 180) {
    return emptyAnalyzer();
  }

  const entities = detectEntities(opts.userText + " " + opts.assistantText, opts.characters, opts.lore ?? [], opts.world);
  const subjectNames = [
    ...entities.characters.map((c) => c.name),
    ...entities.others.map((o) => o.name),
  ];
  const uniqueSubjects = uniq(subjectNames);

  const memories: AnalyzerMemory[] = [];
  for (const pat of PATTERNS) {
    if (!pat.re.test(text)) continue;
    const snippet = sentenceContaining(text, pat.re) ?? summarizeBeat(text, uniqueSubjects, pat.type);
    const inferred = /seemed|perhaps|maybe|might have|as if|looked like/i.test(snippet);
    const explicit = pat.re.test(snippet);
    memories.push({
      type: pat.type,
      subjects: uniqueSubjects.slice(0, 4),
      content: snippet,
      importance: pat.importance,
      confidence: scoreConfidence({ observation: !inferred, explicit, inferred }),
      relationshipImpact: pat.rel,
      observation: !inferred,
    });
  }

  if (memories.length === 0 && entities.characters.length >= 2 && text.length > 400) {
    const inferred = /seemed|perhaps|maybe/i.test(text);
    memories.push({
      type: "event",
      subjects: uniqueSubjects.slice(0, 4),
      content: summarizeBeat(text, uniqueSubjects, "event"),
      importance: 0.52,
      confidence: scoreConfidence({ observation: true, explicit: false, inferred }),
      relationshipImpact: 0.35,
      observation: !inferred,
    });
  }

  const characters: AnalyzerOutput["characters"] = entities.others
    .filter((o) => /^[A-Z]/.test(o.name) && o.name.length > 2)
    .slice(0, 4)
    .map((o) => ({
      name: o.name,
      facts: [sentenceContaining(text, new RegExp(o.name, "i")) ?? `${o.name} appeared in the scene.`],
      confidence: 0.8,
    }));

  const relationshipUpdates: AnalyzerOutput["relationshipUpdates"] = [];
  if (entities.characters.length >= 2) {
    const relMem = memories.find((m) => m.relationshipImpact >= 0.6);
    if (relMem) {
      relationshipUpdates.push({
        a: entities.characters[0].name,
        b: entities.characters[1].name,
        note: relMem.content,
        state: relMem.type === "conflict" ? "In conflict" : "Changed by recent events",
        confidence: relMem.confidence,
      });
    }
  }

  const loc = entities.locations[0]?.name ?? "";
  const storyStateUpdates: AnalyzerOutput["storyStateUpdates"] = {};
  if (loc) storyStateUpdates.location = loc;
  const arrived = uniqueSubjects.filter((name) => nameArrivedInText(text, name));
  if (arrived.length) storyStateUpdates.present = arrived;
  if (memories[0]) storyStateUpdates.recentEvents = memories[0].content;

  return { memories, characters, relationshipUpdates, storyStateUpdates };
}

export function memoriesFromAnalyzer(
  storyId: string,
  chatId: string,
  sourceMessageId: string,
  output: AnalyzerOutput,
  characters: Character[],
): Memory[] {
  const result: Memory[] = [];
  for (const m of output.memories) {
    const status = shouldAutoCommit(m.confidence, m.importance);
    if (status === "reject") continue;
    const characterIds = characters
      .filter((c) =>
        m.subjects.some(
          (s) =>
            c.name.toLowerCase() === s.toLowerCase() ||
            c.aliases.some((a) => a.toLowerCase() === s.toLowerCase()),
        ),
      )
      .map((c) => c.id);
    const created = now();
    result.push({
      id: nid(),
      storyId,
      type: m.type,
      content: m.content.trim(),
      summary: m.content.trim(),
      subjects: m.subjects,
      characterIds,
      importance: clamp01(m.importance),
      confidence: clamp01(m.confidence),
      relationshipImpact: clamp01(m.relationshipImpact),
      emotionalSignificance: clamp01(m.importance * 0.8),
      observation: m.observation,
      sourceMessageId,
      sourceChatId: chatId,
      pinned: false,
      manuallyEdited: false,
      status,
      createdAt: created,
      updatedAt: created,
      retrievalCount: 0,
    });
  }
  return result;
}

export function dedupeMemories(existing: Memory[], incoming: Memory[]): Memory[] {
  const kept: Memory[] = [];
  for (const mem of incoming) {
    if (mem.status === "deleted") continue;
    const dup = existing.find((e) => e.status !== "deleted" && similarMemory(e, mem));
    if (!dup) {
      kept.push(mem);
      continue;
    }
    if (mem.confidence > dup.confidence || mem.manuallyEdited) {
      kept.push({
        ...dup,
        content: mem.content,
        summary: mem.summary,
        confidence: Math.max(dup.confidence, mem.confidence),
        importance: Math.max(dup.importance, mem.importance),
        updatedAt: now(),
      });
    }
  }
  return kept;
}

export function similarMemory(a: Memory, b: Memory): boolean {
  if (a.storyId !== b.storyId) return false;
  const sameType = a.type === b.type;
  const sim = jaccard(tokenize(a.content), tokenize(b.content));
  const sameSubjects =
    a.subjects.length > 0 &&
    b.subjects.length > 0 &&
    a.subjects.some((s) => b.subjects.some((t) => s.toLowerCase() === t.toLowerCase()));
  if (normalizeLine(a.content) === normalizeLine(b.content)) return true;
  if (sameType && sameSubjects && sim >= 0.34) return true;
  const aStem = stemKey(a.content);
  const bStem = stemKey(b.content);
  return sameType && sameSubjects && aStem.size > 0 && [...aStem].some((k) => bStem.has(k));
}

function stemKey(text: string): Set<string> {
  const keys = [
    "protect",
    "promise",
    "vow",
    "kiss",
    "secret",
    "apolog",
    "argu",
    "forgave",
    "reconcil",
    "moved",
    "confess",
  ];
  const lower = text.toLowerCase();
  return new Set(keys.filter((k) => lower.includes(k)));
}

export function consolidatePairEvents(memories: Memory[]): Memory | null {
  const live = memories.filter((m) => m.status !== "deleted");
  const conflicts = live.filter((m) => m.type === "conflict");
  const repairs = live.filter(
    (m) =>
      m.type === "relationship_event" &&
      /apolog|forgave|reconcil/i.test(m.content),
  );
  if (!conflicts.length || !repairs.length) return null;
  const a = conflicts[0];
  const b = repairs[0];
  const subjects = uniq([...a.subjects, ...b.subjects]);
  if (subjects.length < 2) return null;
  const created = now();
  return {
    id: nid(),
    storyId: a.storyId,
    type: "consequence",
    content: `${subjects[0]} and ${subjects[1]} had a conflict but later reconciled.`,
    summary: `${subjects[0]} and ${subjects[1]} reconciled after a conflict.`,
    subjects,
    characterIds: uniq([...a.characterIds, ...b.characterIds]),
    importance: 0.8,
    confidence: Math.min(a.confidence, b.confidence),
    relationshipImpact: 0.84,
    emotionalSignificance: 0.7,
    observation: true,
    sourceMessageId: b.sourceMessageId,
    sourceChatId: b.sourceChatId,
    pinned: false,
    manuallyEdited: false,
    status: "committed",
    createdAt: created,
    updatedAt: created,
    retrievalCount: 0,
  };
}

export function applyRelationshipUpdates(
  existing: Relationship[],
  storyId: string,
  updates: AnalyzerOutput["relationshipUpdates"],
  resolveId: (name: string) => string | undefined,
): Relationship[] {
  const next = [...existing];
  for (const u of updates) {
    const aId = resolveId(u.a);
    const bId = resolveId(u.b);
    if (!aId || !bId || aId === bId) continue;
    const found = next.find(
      (r) =>
        r.storyId === storyId &&
        ((r.aId === aId && r.bId === bId) || (r.aId === bId && r.bId === aId)),
    );
    if (found) {
      found.currentState = u.state ?? found.currentState;
      if (u.label) found.label = u.label;
      if (u.note) found.history = [...found.history, u.note].slice(-12);
      found.confidence = Math.max(found.confidence, u.confidence);
      found.updatedAt = now();
    } else {
      next.push({
        id: nid(),
        storyId,
        aId,
        bId,
        label: u.label ?? "Involved",
        history: u.note ? [u.note] : [],
        currentState: u.state ?? "Developing",
        confidence: u.confidence,
        updatedAt: now(),
      });
    }
  }
  return next;
}

export function mergeStoryState(
  prev: StoryState | undefined,
  patch: AnalyzerOutput["storyStateUpdates"],
  presentIds?: string[],
  tracked?: boolean,
): StoryState {
  const base: StoryState = prev ?? {
    location: "",
    scene: "",
    presentCharacterIds: [],
    time: "",
    goals: "",
    tension: "",
    recentEvents: "",
    emotionalState: "",
    updatedAt: 0,
    tracked: false,
  };
  return {
    location: patch.location ?? base.location,
    scene: patch.scene ?? base.scene,
    presentCharacterIds: presentIds ?? base.presentCharacterIds,
    time: patch.time ?? base.time,
    goals: patch.goals ?? base.goals,
    tension: patch.tension ?? base.tension,
    recentEvents: patch.recentEvents ?? base.recentEvents,
    emotionalState: patch.emotionalState ?? base.emotionalState,
    updatedAt: now(),
    tracked: tracked ?? base.tracked ?? false,
  };
}

export function parseAnalyzerJson(raw: string): AnalyzerOutput | null {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(trimmed.slice(start, end + 1)) as Partial<AnalyzerOutput>;
    if (!Array.isArray(parsed.memories)) return null;
    return {
      memories: parsed.memories.filter(validMemory),
      characters: Array.isArray(parsed.characters) ? parsed.characters : [],
      relationshipUpdates: Array.isArray(parsed.relationshipUpdates)
        ? parsed.relationshipUpdates
        : [],
      storyStateUpdates: parsed.storyStateUpdates ?? {},
    };
  } catch {
    return null;
  }
}

function validMemory(m: AnalyzerMemory): boolean {
  return (
    !!m &&
    typeof m.content === "string" &&
    m.content.trim().length > 0 &&
    typeof m.confidence === "number" &&
    typeof m.importance === "number"
  );
}

function emptyAnalyzer(): AnalyzerOutput {
  return { memories: [], characters: [], relationshipUpdates: [], storyStateUpdates: {} };
}

function sentenceContaining(text: string, re: RegExp): string | null {
  const parts = text.split(/(?<=[.!?])\s+/);
  const hit = parts.find((p) => re.test(p));
  return hit ? hit.trim().slice(0, 280) : null;
}

function summarizeBeat(text: string, subjects: string[], type: string): string {
  const who = subjects.slice(0, 2).join(" and ");
  const first = text.replace(/\s+/g, " ").trim().slice(0, 180);
  if (who) return `${who}: ${first}`;
  return `${type}: ${first}`;
}

function uniq(xs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    const k = x.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

const ARRIVAL =
  /\b(arrived|walked in|came in|entered|joined|showed up|stepped in|steps in|stepped inside)\b/i;

export function nameArrivedInText(text: string, name: string): boolean {
  if (!name.trim()) return false;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const windowed = new RegExp(
    `(${escaped})[^\\n.]{0,72}${ARRIVAL.source}|${ARRIVAL.source}[^\\n.]{0,72}(${escaped})`,
    "i",
  );
  return windowed.test(text);
}

export function arrivingIdsFromText(
  text: string,
  names: string[],
  resolveId: (name: string) => string | undefined,
): string[] {
  const ids: string[] = [];
  for (const name of names) {
    if (!nameArrivedInText(text, name)) continue;
    const id = resolveId(name);
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}
