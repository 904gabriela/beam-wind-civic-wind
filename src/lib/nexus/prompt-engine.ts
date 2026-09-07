import type { ComposedPreset } from "./presets.ts";
import { estimateTokens } from "./tokens.ts";
import { memoryProvenance } from "./context-engine.ts";
import type {
  Character,
  ContextPack,
  GenerationTrace,
  LoreEntry,
  Memory,
  Persona,
  PromptBlock,
  PromptBlockKind,
  Relationship,
  Story,
  StoryState,
} from "./types.ts";

const DEFAULT_ORDER: PromptBlockKind[] = [
  "system",
  "style",
  "story",
  "character",
  "persona",
  "world",
  "lore",
  "relationships",
  "memory",
  "storyState",
  "examples",
  "chat",
  "user",
];

export function buildPrompt(opts: {
  story: Story;
  pack: ContextPack;
  preset: ComposedPreset;
  userText: string;
  order?: PromptBlockKind[];
}): { messages: { role: "system" | "user" | "assistant"; content: string }[]; trace: GenerationTrace } {
  const order = opts.order ?? DEFAULT_ORDER;
  const blocks: PromptBlock[] = [];

  const push = (kind: PromptBlockKind, title: string, content: string, rank = 1) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    blocks.push({
      id: `${kind}-${blocks.length}`,
      kind,
      title,
      content: trimmed,
      tokens: estimateTokens(trimmed),
      included: true,
      rank,
    });
  };

  push("system", "System", SYSTEM_CORE);
  push("style", "Generation style", `Active style: ${opts.preset.name}\n\n${opts.preset.instructions}\n\nStyle affects prose only. It never overrides persona lock, scene presence, or character identity.`);
  push(
    "story",
    "Story",
    `Story: ${opts.story.name}\n${opts.story.description}\n\nAuthority: character definitions and established story events outrank style instructions. Never force outcomes the characters would not choose.`,
  );

  for (const c of opts.pack.characters) {
    push("character", c.name, renderCharacter(c), c.origin === "discovered" ? 0.6 : 1);
  }

  push("persona", "User persona — do not write", renderPersona(opts.pack.persona));

  if (opts.pack.world) {
    push("world", opts.pack.world.name, opts.pack.world.description);
  }
  if (opts.pack.lore.length) {
    push(
      "lore",
      "Relevant lore",
      `${opts.pack.lore.map(renderLore).join("\n\n")}\n\nLore is background knowledge only. It must never create physical presence or walk an Absent character into the scene.`,
    );
  }
  if (opts.pack.relationships.length) {
    push(
      "relationships",
      "Relationships",
      opts.pack.relationships.map((r) => renderRelationship(r, opts.pack)).join("\n"),
    );
  }
  if (opts.pack.memories.length) {
    push(
      "memory",
      "Memory matrix",
      `Provenance: CANON is user-pinned or edited. SEEN happened in a scene. GUESSED is inference — not fact, do not treat it as canon.\n${opts.pack.memories.map(renderMemory).join("\n")}\n\nMemory is continuity, not a guest list. Recalling someone does not put them in the room.`,
    );
  }
  push("storyState", "Scene and story state", renderState(opts.pack.storyState, opts.pack));

  const examples = opts.pack.characters
    .map((c) => c.exampleDialogue.trim())
    .filter(Boolean)
    .join("\n\n");
  if (examples) push("examples", "Example voice (present characters only)", examples);

  const history = opts.pack.chat.filter((m) => m.content.trim());
  const userBlock = opts.userText.trim();
  const ordered = order
    .filter((k) => k !== "chat" && k !== "user")
    .flatMap((k) => blocks.filter((b) => b.kind === k));

  applyBudget(ordered, opts.pack.budget.total - estimateTokens(userBlock) - 1500);

  const system = ordered.map((b) => `### ${b.title}\n${b.content}`).join("\n\n");
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: system },
  ];
  for (const m of history) {
    if (m.role === "system") continue;
    messages.push({ role: m.role, content: stripMeta(m.content) });
  }
  if (!history.some((m) => m.role === "user" && m.content === userBlock)) {
    messages.push({ role: "user", content: userBlock });
  }

  const trace: GenerationTrace = {
    at: Date.now(),
    blocks: [...ordered, { id: "user", kind: "user", title: "Current user", content: userBlock, tokens: estimateTokens(userBlock), included: true, rank: 1 }],
    totalTokens: ordered.reduce((s, b) => s + b.tokens, 0) + estimateTokens(userBlock),
    memoryIds: opts.pack.memories.map((m) => m.id),
    loreIds: opts.pack.lore.map((l) => l.id),
    characterIds: opts.pack.characters.map((c) => c.id),
    presetNames: [opts.preset.name],
    storyState: opts.pack.storyState,
  };

  return { messages, trace };
}

function applyBudget(blocks: PromptBlock[], budget: number) {
  let total = blocks.reduce((s, b) => s + b.tokens, 0);
  if (total <= budget) return;
  const dropOrder: PromptBlockKind[] = ["examples", "lore", "memory", "world", "relationships"];
  for (const kind of dropOrder) {
    for (const b of [...blocks].reverse()) {
      if (total <= budget) return;
      if (b.kind !== kind || !b.included) continue;
      b.included = false;
      b.content = "";
      total -= b.tokens;
      b.tokens = 0;
    }
  }
  const kept = blocks.filter((b) => b.included);
  blocks.length = 0;
  blocks.push(...kept);
}

function renderCharacter(c: Character): string {
  if (c.origin === "discovered") {
    const facts = c.observedFacts.map((f) => `- ${f.content} (confidence ${f.confidence.toFixed(2)})`).join("\n");
    return `IN SCENE — you may write this character.\nName: ${c.name}\nStatus: Automatically discovered\nOnly use established facts. Do not invent a full biography.\nKnown facts:\n${facts || "- Present in the current storyline."}`;
  }
  const rows: [string, string][] = [
    ["Name", c.name],
    ["Aliases", c.aliases.join(", ")],
    ["Description", c.description],
    ["Personality", c.personality],
    ["Appearance", c.appearance],
    ["Background", c.background],
    ["Behavior", c.behavior],
    ["Speech", c.speechStyle],
    ["Likes", c.likes],
    ["Dislikes", c.dislikes],
    ["Fears", c.fears],
    ["Goals", c.goals],
    ["Secrets (do not leak to those who do not know)", c.secrets],
    ["Abilities", c.abilities],
    ["Scenario", c.scenario],
    ["Instructions", c.systemInstructions],
  ];
  const body = rows
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return `IN SCENE — you may write this character's speech, actions, and interiority.\n${body}`;
}

function renderPersona(p?: Persona): string {
  const lock =
    "The user controls this persona. NEVER invent the persona's dialogue, thoughts, feelings, decisions, or next actions unless the user already supplied them in the current turn.\nHistorical lines attributed to the persona are past events. They do not license you to write the persona now.";
  if (!p) {
    return `${lock}\n\nThe human user is playing themselves. Do not write their lines.`;
  }
  const details = [
    `Name: ${p.name}`,
    p.appearance && `Appearance: ${p.appearance}`,
    p.personality && `Personality: ${p.personality}`,
    p.background && `Background: ${p.background}`,
    p.behavior && `Behavior: ${p.behavior}`,
    p.speechStyle && `Speech: ${p.speechStyle}`,
    p.preferences && `Preferences: ${p.preferences}`,
    p.abilities && `Abilities: ${p.abilities}`,
  ]
    .filter((line): line is string => Boolean(line) && !line.endsWith(": "))
    .join("\n");
  return `${lock}\n\nNEVER write ${p.name}'s dialogue, thoughts, feelings, decisions, or next actions unless the user already wrote them in this turn.\n\n${details}`;
}

function renderLore(l: LoreEntry): string {
  return `• ${l.title}: ${l.content}`;
}

function renderMemory(m: Memory): string {
  const origin = memoryProvenance(m).toUpperCase();
  const pin = m.pinned ? " [PINNED]" : "";
  const auth = m.manuallyEdited ? " [USER-EDITED]" : "";
  return `• [${origin}] (${m.type}, importance ${m.importance.toFixed(2)}, confidence ${m.confidence.toFixed(2)})${pin}${auth} ${m.content}`;
}

function renderRelationship(r: Relationship, pack: ContextPack): string {
  const name = (id: string) =>
    pack.characters.find((c) => c.id === id)?.name ??
    pack.absentCharacters.find((c) => c.id === id)?.name ??
    (pack.persona?.id === id ? pack.persona.name : id);
  return `• ${name(r.aId)} ↔ ${name(r.bId)}: ${r.label}. ${r.currentState}. ${r.history.slice(-3).join(" ")}`;
}

function resolveName(id: string, pack: ContextPack): string | undefined {
  if (pack.persona?.id === id) return pack.persona.name;
  return (
    pack.characters.find((c) => c.id === id)?.name ??
    pack.absentCharacters.find((c) => c.id === id)?.name
  );
}

function renderState(s: StoryState | undefined, pack: ContextPack): string {
  const personaName = pack.persona?.name;
  const presentNpc = (s?.presentCharacterIds ?? pack.characters.map((c) => c.id))
    .map((id) => resolveName(id, pack))
    .filter((n): n is string => !!n && n !== personaName);
  const absent = (pack.absentCharacters ?? [])
    .map((c) => c.name)
    .filter((n) => n && n !== personaName);
  return [
    s?.location && `Location: ${s.location}`,
    s?.scene && `Scene: ${s.scene}`,
    presentNpc.length && `Present: ${presentNpc.join(", ")}`,
    personaName && `User persona in scene: ${personaName} — do not write this character`,
    absent.length && `Absent — must not enter, speak, or be nearby: ${absent.join(", ")}`,
    absent.length &&
      "Lore, memory, and older chat that mention Absent people are background only. They do not create physical presence.",
    s?.time && `Time: ${s.time}`,
    s?.goals && `Goals: ${s.goals}`,
    s?.tension && `Tension: ${s.tension}`,
    s?.recentEvents && `Recent: ${s.recentEvents}`,
    s?.emotionalState && `Emotional state: ${s.emotionalState}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function stripMeta(text: string): string {
  return text.replace(/<choices>[\s\S]*?<\/choices>/gi, "").trim();
}

const SYSTEM_CORE = `You are the storyteller inside Nexus, a private long-form roleplay engine.

The LLM renders the story. Nexus already managed context for you. Use what you are given. Do not invent a conflicting canon.

Conflict hierarchy (highest wins):
1. Explicit user instruction in the current message
2. Current story events in the recent chat
3. Pinned or manually edited story knowledge
4. Character definition
5. Established memories
6. Lore
7. Your inference

Control:
- The user controls their persona. You control narration and NPCs who are present.
- NEVER invent the persona's dialogue, thoughts, feelings, decisions, or next actions unless the user already supplied them in the current turn.
- Historical lines spoken by the persona (or labeled as them) are past events. They do not license you to write the persona now.
- Style presets affect prose, never identity. A romantic or slow-burn style does not make a character suddenly romantic or in love.

Presence:
- Existence and presence are different. Cast members may exist without being in this scene.
- Write ONLY characters listed as Present. Absent characters must not enter, speak, or be revealed to be nearby.
- Lore, memories, and old chat mentioning someone do not create physical presence. Do not invent a reason for an absent character to arrive.

Continuation:
- A short user turn is still a full roleplay beat. Continue the scene from where it currently stands.
- Treat the user's turn as an invitation to play out what happens next: NPC reaction, environment, dialogue, physical response.
- Do not merely acknowledge the message and stop.
- Use whatever combination of dialogue, action, narration, and present-character interiority the scene naturally requires.
- Stop at a natural beat. Do not pad. Do not recap. Do not summarize. Do not write meta commentary.

Rules:
- Stay in scene. Do not mention being an AI, a model, or Nexus.
- Do not force romance, friendship, reconciliation, or plot twists the characters would not choose.
- Discovered characters may only use listed facts. Do not hallucinate biographies.
- Secrets are knowledge-bounded: a character who does not know a secret must not speak as if they do.
- Mix *action/body language* with spoken dialogue in quotes.
- All characters portrayed are adults.
- Keep intimacy literary. Do not write explicit sexual content.
- Continuity first: who is present, where they are, what just happened, what was promised.`;
