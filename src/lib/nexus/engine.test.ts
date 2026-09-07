import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addMessage,
  pathToRoot,
  siblingIndex,
  siblingsOf,
  switchToSibling,
} from "./chat-tree.ts";
import { retrieveContext, activateLore, memoriesOnPath, memoryProvenance } from "./context-engine.ts";
import { discoverCharacters } from "./discovery.ts";
import { importPayload } from "./import-export.ts";
import { loreForStory } from "./lorebooks.ts";
import {
  consolidatePairEvents,
  dedupeMemories,
  extractHeuristic,
  memoriesFromAnalyzer,
  nameArrivedInText,
  parseAnalyzerJson,
  scoreConfidence,
  shouldAutoCommit,
  similarMemory,
} from "./memory-engine.ts";
import { composePresets, BUILTIN_PRESETS } from "./presets.ts";
import { buildPrompt } from "./prompt-engine.ts";
import { searchAll } from "./search.ts";
import { estimateTokens } from "./tokens.ts";
import { ollamaChatOptions } from "../llm/types.ts";
import type {
  Character,
  Chat,
  ChatMessage,
  Lorebook,
  LoreEntry,
  Memory,
  Persona,
  Story,
  StoryState,
} from "./types.ts";

function char(id: string, name: string): Character {
  const t = 1;
  return {
    id,
    name,
    aliases: [],
    description: "",
    personality: "sharp",
    appearance: "",
    background: "",
    history: "",
    behavior: "",
    speechStyle: "",
    likes: "",
    dislikes: "",
    fears: "",
    goals: "",
    secrets: "",
    abilities: "",
    scenario: "",
    exampleDialogue: "",
    systemInstructions: "",
    creatorNotes: "",
    tags: [],
    origin: "manual",
    observedFacts: [],
    confidence: 1,
    createdAt: t,
    updatedAt: t,
  };
}

function story(partial: Partial<Story> = {}): Story {
  return {
    id: "s1",
    name: "MHA",
    description: "Canon roleplay",
    characterIds: ["reiko", "bakugo"],
    loreIds: [],
    lorebookIds: [],
    presetIds: ["preset-slow-burn"],
    chatId: "c1",
    autoMemories: true,
    autoCharacters: true,
    memoryMatrix: true,
    loreActivation: "smart",
    contextSize: 24000,
    createdAt: 1,
    updatedAt: 1,
    ...partial,
  };
}

describe("chat tree", () => {
  it("walks from leaf to root and keeps branches", () => {
    const chat: Chat = {
      id: "c1",
      storyId: "s1",
      rootMessageId: "a",
      activeLeafId: "d",
      canonLeafId: "d",
    };
    const messages: Record<string, ChatMessage> = {
      a: { id: "a", chatId: "c1", parentId: null, role: "assistant", content: "A", createdAt: 1 },
      b: { id: "b", chatId: "c1", parentId: "a", role: "user", content: "B", createdAt: 2 },
      c: { id: "c", chatId: "c1", parentId: "b", role: "assistant", content: "C", createdAt: 3 },
      d: { id: "d", chatId: "c1", parentId: "c", role: "user", content: "D", createdAt: 4 },
      c2: { id: "c2", chatId: "c1", parentId: "b", role: "assistant", content: "C2", createdAt: 5 },
    };
    const path = pathToRoot(messages, "d").map((m) => m.id);
    assert.deepEqual(path, ["a", "b", "c", "d"]);
    const sibs = siblingsOf(messages, messages.c);
    assert.equal(sibs.length, 2);
    const switched = switchToSibling(messages, chat, messages.c, 1);
    assert.equal(switched.activeLeafId, "c2");
  });

  it("regeneration adds a sibling instead of overwriting", () => {
    let chat: Chat = {
      id: "c1",
      storyId: "s1",
      rootMessageId: "u",
      activeLeafId: "a1",
      canonLeafId: "a1",
    };
    let messages: Record<string, ChatMessage> = {
      u: { id: "u", chatId: "c1", parentId: null, role: "user", content: "Hi", createdAt: 1 },
      a1: { id: "a1", chatId: "c1", parentId: "u", role: "assistant", content: "One", createdAt: 2 },
    };
    const added = addMessage(messages, chat, {
      id: "a2",
      chatId: "c1",
      parentId: "u",
      role: "assistant",
      content: "Two",
      createdAt: 3,
    });
    messages = added.messages;
    chat = added.chat;
    assert.equal(chat.activeLeafId, "a2");
    assert.equal(messages.a1.content, "One");
    assert.equal(siblingIndex(messages, messages.a2).total, 2);
  });
});

describe("memory engine", () => {
  const reiko = char("reiko", "Reiko");
  const bakugo = char("bakugo", "Bakugo");

  it("extracts a kiss and a secret as high-confidence memories", () => {
    const out = extractHeuristic({
      storyId: "s1",
      chatId: "c1",
      sourceMessageId: "m1",
      userText:
        'Reiko leaned forward and kissed Bakugo before whispering, "I never told anyone this, but…"',
      assistantText: "Bakugo froze, the secret landing harder than the kiss.",
      characters: [reiko, bakugo],
    });
    assert.ok(out.memories.some((m) => m.type === "relationship_event"));
    assert.ok(out.memories.some((m) => m.type === "secret"));
    assert.ok(out.memories.every((m) => m.confidence > 0.7));
  });

  it("does not commit trivial beats", () => {
    const out = extractHeuristic({
      storyId: "s1",
      chatId: "c1",
      sourceMessageId: "m1",
      userText: "Reiko dropped her phone.",
      assistantText: "It clattered.",
      characters: [reiko, bakugo],
    });
    assert.equal(out.memories.length, 0);
  });

  it("treats observation and inference differently", () => {
    const observed = scoreConfidence({ observation: true, explicit: true, inferred: false });
    const inferred = scoreConfidence({ observation: false, explicit: false, inferred: true });
    assert.ok(observed > 0.9);
    assert.ok(inferred < 0.5);
    assert.equal(shouldAutoCommit(inferred, 0.6), "reject");
    assert.equal(shouldAutoCommit(observed, 0.9), "committed");
  });

  it("deduplicates paraphrased promises", () => {
    const base = memoriesFromAnalyzer(
      "s1",
      "c1",
      "m1",
      {
        memories: [
          {
            type: "promise",
            subjects: ["Reiko", "Bakugo"],
            content: "Bakugo promised Reiko he would protect her.",
            importance: 0.9,
            confidence: 0.95,
            relationshipImpact: 0.7,
            observation: true,
          },
        ],
        characters: [],
        relationshipUpdates: [],
        storyStateUpdates: {},
      },
      [reiko, bakugo],
    );
    const incoming = memoriesFromAnalyzer(
      "s1",
      "c1",
      "m2",
      {
        memories: [
          {
            type: "promise",
            subjects: ["Bakugo", "Reiko"],
            content: "Bakugo vowed to protect Reiko.",
            importance: 0.88,
            confidence: 0.9,
            relationshipImpact: 0.7,
            observation: true,
          },
        ],
        characters: [],
        relationshipUpdates: [],
        storyStateUpdates: {},
      },
      [reiko, bakugo],
    );
    assert.equal(similarMemory(base[0], incoming[0]), true);
    const kept = dedupeMemories(base, incoming);
    assert.equal(kept.length, 0);
  });

  it("consolidates argument then apology without deleting sources", () => {
    const a: Memory = {
      id: "1",
      storyId: "s1",
      type: "conflict",
      content: "Reiko and Bakugo argued.",
      summary: "argued",
      subjects: ["Reiko", "Bakugo"],
      characterIds: ["reiko", "bakugo"],
      importance: 0.7,
      confidence: 0.9,
      relationshipImpact: 0.7,
      emotionalSignificance: 0.6,
      observation: true,
      pinned: false,
      manuallyEdited: false,
      status: "committed",
      createdAt: 1,
      updatedAt: 1,
      retrievalCount: 0,
    };
    const b: Memory = {
      ...a,
      id: "2",
      type: "relationship_event",
      content: "Reiko apologized and Bakugo forgave her.",
      summary: "apologized",
    };
    const cons = consolidatePairEvents([a, b]);
    assert.ok(cons);
    assert.match(cons!.content, /reconciled/i);
    assert.equal(a.status, "committed");
  });

  it("rejects malformed analyzer JSON", () => {
    assert.equal(parseAnalyzerJson("not json"), null);
    assert.equal(parseAnalyzerJson('{"hello":1}'), null);
    const ok = parseAnalyzerJson(
      '{"memories":[{"type":"event","subjects":["Reiko"],"content":"Moved to Japan.","importance":0.8,"confidence":0.9,"relationshipImpact":0.1,"observation":true}]}',
    );
    assert.ok(ok);
    assert.equal(ok!.memories.length, 1);
  });
});

describe("character discovery", () => {
  it("creates a minimal character for an unknown name", () => {
    const known = [char("reiko", "Reiko"), char("bakugo", "Bakugo")];
    const found = discoverCharacters({
      text: "Aizawa walked into the room and told Reiko to sit.",
      known,
      sourceMessageId: "104",
    });
    assert.ok(found.some((c) => c.name === "Aizawa"));
    const aizawa = found.find((c) => c.name === "Aizawa")!;
    assert.equal(aizawa.origin, "discovered");
    assert.equal(aizawa.personality, "");
    assert.ok(aizawa.observedFacts.length >= 1);
  });
});

describe("context and prompt engines", () => {
  it("retrieves relevant lore and memories, not unrelated ones", () => {
    const reiko = char("reiko", "Reiko");
    const bakugo = char("bakugo", "Bakugo");
    const kirishima = char("kiri", "Kirishima");
    const lore: LoreEntry[] = [
      {
        id: "l1",
        title: "U.A. High",
        content: "U.A. High School is located in Japan.",
        keywords: ["U.A.", "UA", "school"],
        aliases: ["UA"],
        category: "location",
        priority: 10,
        importance: 0.8,
        enabled: true,
        always: false,
        createdAt: 1,
      },
      {
        id: "l2",
        title: "Dessert menu",
        content: "The bakery two towns over sells melon bread.",
        keywords: ["bakery", "melon"],
        aliases: [],
        category: "trivia",
        priority: 1,
        importance: 0.1,
        enabled: true,
        always: false,
        createdAt: 1,
      },
    ];
    const memories: Memory[] = [
      {
        id: "m1",
        storyId: "s1",
        type: "promise",
        content: "Bakugo promised Reiko he would protect her.",
        summary: "promise",
        subjects: ["Bakugo", "Reiko"],
        characterIds: ["bakugo", "reiko"],
        importance: 0.9,
        confidence: 0.95,
        relationshipImpact: 0.8,
        emotionalSignificance: 0.7,
        observation: true,
        pinned: true,
        manuallyEdited: false,
        status: "committed",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        retrievalCount: 0,
      },
      {
        id: "m2",
        storyId: "s1",
        type: "fact",
        content: "Kirishima bought extra protein powder.",
        summary: "protein",
        subjects: ["Kirishima"],
        characterIds: ["kiri"],
        importance: 0.2,
        confidence: 0.9,
        relationshipImpact: 0,
        emotionalSignificance: 0,
        observation: true,
        pinned: false,
        manuallyEdited: false,
        status: "committed",
        createdAt: 1,
        updatedAt: 1,
        retrievalCount: 0,
      },
    ];
    const pack = retrieveContext(
      {
        story: story(),
        characters: [reiko, bakugo, kirishima],
        lore,
        memories,
        relationships: [],
        transcript: [],
      },
      "Bakugo took Reiko back to U.A. and remembered his promise.",
    );
    assert.ok(pack.lore.some((l) => l.id === "l1"));
    assert.ok(!pack.lore.some((l) => l.id === "l2"));
    assert.equal(pack.memories[0]?.id, "m1");
  });

  it("builds a prompt with style below system and never dumps unrelated memory", () => {
    const reiko = char("reiko", "Reiko");
    const pack = retrieveContext(
      {
        story: story(),
        characters: [reiko],
        lore: [],
        memories: [],
        relationships: [],
        transcript: [
          {
            id: "u",
            chatId: "c1",
            parentId: null,
            role: "user",
            content: "Hello",
            createdAt: 1,
          },
        ],
      },
      "Hello",
    );
    const { messages, trace } = buildPrompt({
      story: story(),
      pack,
      preset: composePresets([BUILTIN_PRESETS.find((p) => p.id === "preset-slow-burn")!]),
      userText: "Hello",
    });
    assert.equal(messages[0].role, "system");
    assert.match(messages[0].content, /Slow Burn/);
    assert.match(messages[0].content, /Reiko/);
    assert.ok(trace.totalTokens > 0);
    assert.ok(estimateTokens(messages[0].content) < 20000);
  });
});

function persona(id: string, name: string): Persona {
  const t = 1;
  return {
    id,
    name,
    appearance: "Dark hair, sharp smile",
    personality: "Playful, stubborn",
    background: "UA student",
    behavior: "Teases when nervous",
    speechStyle: "Casual",
    preferences: "",
    abilities: "",
    tags: [],
    isDefault: true,
    createdAt: t,
    updatedAt: t,
  };
}

function hospitalScene() {
  const bakugo = char("bakugo", "Bakugo");
  bakugo.personality = "Explosive, proud, loyal. Never suddenly gentle without cause.";
  bakugo.description = "Katsuki Bakugo, recovering in a hospital bed after the war.";
  const kirishima = char("kiri", "Kirishima");
  kirishima.description = "Red Riot. Bakugo's close friend.";
  kirishima.personality = "Manly, earnest, always smiling.";
  kirishima.background = "Kirishima's entire backstory including Unbreakable.";
  const midoriya = char("deku", "Midoriya");
  midoriya.description = "Deku, not in this room.";
  const reiko = persona("reiko", "Reiko Ryuusui");
  const lore: LoreEntry[] = [
    {
      id: "l-kiri",
      title: "Kirishima at UA",
      content: "Kirishima Eijiro is Bakugo's classmate and often visits friends.",
      keywords: ["Kirishima"],
      aliases: [],
      category: "character",
      priority: 8,
      importance: 0.6,
      enabled: true,
      always: false,
      createdAt: 1,
    },
  ];
  const memories: Memory[] = [
    {
      id: "m-kiri",
      storyId: "s1",
      type: "fact",
      content: "Kirishima bought extra protein powder.",
      summary: "protein",
      subjects: ["Kirishima"],
      characterIds: ["kiri"],
      importance: 0.2,
      confidence: 0.9,
      relationshipImpact: 0,
      emotionalSignificance: 0,
      observation: true,
      pinned: false,
      manuallyEdited: false,
      status: "committed",
      createdAt: 1,
      updatedAt: 1,
      retrievalCount: 0,
    },
  ];
  const storyState: StoryState = {
    location: "Hospital room after the war",
    scene: "Reiko is visiting Bakugo. They have been teasing playfully.",
    presentCharacterIds: ["bakugo"],
    time: "Afternoon",
    goals: "",
    tension: "Soft teasing over a hard recovery",
    recentEvents: "Kirishima visited yesterday, then left.",
    emotionalState: "Playful, tired",
    updatedAt: 1,
  };
  const st = story({
    name: "My Hero Academia — Reiko & Bakugo",
    characterIds: ["bakugo", "kiri", "deku"],
    personaId: "reiko",
    presetIds: ["preset-slow-burn", "preset-romantic"],
  });
  const transcript: ChatMessage[] = [
    {
      id: "a0",
      chatId: "c1",
      parentId: null,
      role: "assistant",
      content: "Kirishima had visited yesterday with extra protein shakes, then left. Bakugo was alone when Reiko arrived.",
      createdAt: 1,
    },
    {
      id: "u1",
      chatId: "c1",
      parentId: "a0",
      role: "user",
      content: 'Reiko: "You look terrible."',
      createdAt: 2,
    },
    {
      id: "a1",
      chatId: "c1",
      parentId: "u1",
      role: "assistant",
      content: "Bakugo clicked his tongue. Kirishima would have laughed.",
      createdAt: 3,
    },
  ];
  const pack = retrieveContext(
    {
      story: st,
      characters: [bakugo, kirishima, midoriya],
      persona: reiko,
      lore,
      memories,
      relationships: [],
      storyState,
      transcript,
    },
    'my face lights up mischievously\n\n"oh? is that so?"',
  );
  const { messages, trace } = buildPrompt({
    story: st,
    pack,
    preset: composePresets(
      BUILTIN_PRESETS.filter((p) => ["preset-slow-burn", "preset-romantic"].includes(p.id)),
    ),
    userText: 'my face lights up mischievously\n\n"oh? is that so?"',
  });
  return { pack, messages, trace, bakugo, kirishima };
}

describe("roleplay payload — persona, presence, continuation", () => {
  it("inspects the actual system payload: persona lock, present Bakugo, absent Kirishima not dumped, continuation", () => {
    const { pack, messages } = hospitalScene();
    const system = messages[0].content;
    assert.equal(messages[0].role, "system");
    assert.match(system, /NEVER invent the persona/i);
    assert.match(system, /NEVER write Reiko Ryuusui/i);
    assert.match(system, /Continue the scene/i);
    assert.match(system, /invitation to play/i);
    assert.match(system, /Present:[^\n]*Bakugo/);
    assert.match(system, /Explosive, proud, loyal/);
    assert.match(system, /Absent[^\n]*Kirishima/);
    assert.match(system, /Absent[^\n]*Midoriya/);
    assert.doesNotMatch(system, /Present:[^\n]*Kirishima/);
    assert.doesNotMatch(system, /Unbreakable/);
    assert.doesNotMatch(system, /always smiling/);
    assert.ok(!pack.characters.some((c) => c.id === "kiri"));
    assert.ok(pack.absentCharacters.some((c) => c.id === "kiri"));
    assert.ok(pack.characters.some((c) => c.id === "bakugo"));
    assert.match(system, /Slow Burn/);
    assert.match(system, /Romantic/);
    const last = messages[messages.length - 1];
    assert.equal(last.role, "user");
    assert.match(last.content, /oh\? is that so/);
  });

  it("historical Reiko dialogue in the transcript does not remove the persona lock from the payload", () => {
    const { messages } = hospitalScene();
    const system = messages[0].content;
    assert.match(system, /Historical lines/i);
    assert.ok(messages.some((m) => m.role === "user" && /Reiko:/.test(m.content)));
    assert.match(system, /do not license you to write the persona/i);
  });

  it("mentioned-in-history Kirishima does not receive a full character card when SceneState marks him absent", () => {
    const { pack, messages } = hospitalScene();
    const system = messages[0].content;
    assert.ok(pack.chat.some((m) => /Kirishima/.test(m.content)));
    assert.doesNotMatch(system, /Personality: Manly/);
    assert.doesNotMatch(system, /IN SCENE[^\n]*Kirishima/);
    assert.match(system, /do not create physical presence/i);
  });
});

describe("presets", () => {
  it("composes slow burn + detailed + cinematic", () => {
    const ids = ["preset-slow-burn", "preset-detailed", "preset-cinematic"];
    const composed = composePresets(BUILTIN_PRESETS.filter((p) => ids.includes(p.id)));
    assert.match(composed.name, /Slow Burn/);
    assert.match(composed.instructions, /Cinematic/);
    assert.ok(composed.maxTokens >= 1200);
    assert.ok(composed.temperature > 0.8);
  });
});

describe("import", () => {
  it("imports a SillyTavern v2 character card", () => {
    const raw = JSON.stringify({
      spec: "chara_card_v2",
      spec_version: "2.0",
      data: {
        name: "Bakugo",
        description: "Explosive hero student.",
        personality: "Loud, proud, loyal.",
        scenario: "U.A. dorms after hours.",
        first_mes: "The hell do you want?",
        mes_example: "{{user}}: Hey\n{{char}}: Spit it out.",
        system_prompt: "Stay in character.",
        tags: ["MHA"],
        character_book: {
          entries: [
            { keys: ["Explosion", "Quirk"], content: "Bakugo's Quirk is Explosion.", comment: "Quirk" },
          ],
        },
      },
    });
    const bundle = importPayload(raw);
    assert.equal(bundle.characters[0]?.name, "Bakugo");
    assert.equal(bundle.characters[0]?.origin, "imported");
    assert.equal(bundle.lore.length, 1);
    assert.match(bundle.lore[0].content, /Explosion/);
  });

  it("imports a persona and a lorebook", () => {
    const persona = importPayload(
      JSON.stringify({
        format: "nexus",
        kind: "persona",
        personas: [{ name: "Ash Calder", personality: "Quiet.", preferences: "Call me Ash." }],
      }),
    );
    assert.equal(persona.kind, "persona");
    assert.equal(persona.personas[0]?.name, "Ash Calder");

    const book = importPayload(
      JSON.stringify({
        name: "Ashfell",
        entries: [{ comment: "Gate", keys: ["north gate"], content: "The north gate closes at dusk." }],
      }),
    );
    assert.equal(book.kind, "lorebook");
    assert.equal(book.lorebooks[0]?.name, "Ashfell");
    assert.equal(book.lore.length, 1);
    assert.ok(book.lore[0].keywords.includes("north gate"));
  });
});

describe("lorebooks", () => {
  it("only injects entries from attached or global books", () => {
    const book: Lorebook = {
      id: "b1",
      name: "U.A.",
      description: "",
      tags: [],
      enabled: true,
      global: false,
      createdAt: 1,
      updatedAt: 1,
    };
    const entry: LoreEntry = {
      id: "e1",
      lorebookId: "b1",
      title: "Quirk",
      content: "Explosion",
      keywords: ["quirk"],
      aliases: [],
      category: "general",
      priority: 10,
      importance: 0.5,
      enabled: true,
      always: false,
      createdAt: 1,
    };
    const detached = loreForStory(story(), [entry], [book]);
    assert.equal(detached.length, 0);
    const attached = loreForStory(story({ lorebookIds: ["b1"] }), [entry], [book]);
    assert.equal(attached.length, 1);
  });
});

describe("search", () => {
  it("finds across stories and memories", () => {
    const hits = searchAll({
      query: "protect",
      stories: [story({ description: "A promise to protect" })],
      characters: [char("bakugo", "Bakugo")],
      personas: [],
      worlds: [],
      lore: [],
      memories: [],
    });
    assert.ok(hits.some((h) => h.kind === "story"));
  });
});

describe("lore recursion and always-on", () => {
  const ua: LoreEntry = {
    id: "always",
    title: "U.A. High",
    content: "The school stands in Japan.",
    keywords: ["campus"],
    aliases: [],
    category: "location",
    priority: 10,
    importance: 0.9,
    enabled: true,
    always: true,
    createdAt: 1,
  };
  const explosion: LoreEntry = {
    id: "explosion",
    title: "Explosion",
    content: "Bakugo's Quirk is Explosion.",
    keywords: ["Explosion", "Quirk"],
    aliases: [],
    category: "ability",
    priority: 8,
    importance: 0.7,
    enabled: true,
    always: false,
    createdAt: 1,
  };
  const bakugoCard: LoreEntry = {
    id: "b-card",
    title: "Bakugo card",
    content: "See also Explosion when he fights.",
    keywords: ["Bakugo"],
    aliases: [],
    category: "character",
    priority: 8,
    importance: 0.7,
    enabled: true,
    always: false,
    createdAt: 1,
  };

  it("always includes constant entries and recurses from activated content", () => {
    const out = activateLore(
      [ua, bakugoCard, explosion],
      { characters: [{ kind: "character", name: "Bakugo", id: "bakugo" }], locations: [], others: [], keywords: [] },
      "Bakugo scowled at the ceiling.",
      "smart",
    );
    assert.ok(out.some((e) => e.id === "always"));
    assert.ok(out.some((e) => e.id === "b-card"));
    assert.ok(out.some((e) => e.id === "explosion"));
  });

  it("respects preventRecursion", () => {
    const locked = { ...explosion, preventRecursion: true };
    const out = activateLore(
      [bakugoCard, locked],
      { characters: [{ kind: "character", name: "Bakugo", id: "bakugo" }], locations: [], others: [], keywords: [] },
      "Bakugo scowled.",
      "smart",
    );
    assert.ok(out.some((e) => e.id === "b-card"));
    assert.ok(!out.some((e) => e.id === "explosion"));
  });
});

describe("branch memory and provenance", () => {
  it("drops memories from discarded branches unless pinned or edited", () => {
    const path = new Set(["a1"]);
    const live: Memory = {
      id: "m-live",
      storyId: "s1",
      type: "promise",
      content: "Bakugo promised Reiko he would protect her.",
      summary: "promise",
      subjects: ["Bakugo"],
      characterIds: ["bakugo"],
      importance: 0.9,
      confidence: 0.95,
      relationshipImpact: 0.8,
      emotionalSignificance: 0.7,
      observation: true,
      sourceMessageId: "a1",
      pinned: false,
      manuallyEdited: false,
      status: "committed",
      createdAt: 1,
      updatedAt: 1,
      retrievalCount: 0,
    };
    const other: Memory = { ...live, id: "m-other", sourceMessageId: "a-discarded", content: "Kirishima bought protein." };
    const pinned: Memory = { ...other, id: "m-pin", pinned: true, content: "Canon: they fought in the war." };
    const kept = memoriesOnPath([live, other, pinned], path);
    assert.ok(kept.some((m) => m.id === "m-live"));
    assert.ok(!kept.some((m) => m.id === "m-other"));
    assert.ok(kept.some((m) => m.id === "m-pin"));
    assert.equal(memoryProvenance(pinned), "canon");
    assert.equal(memoryProvenance(live), "seen");
  });
});

describe("presence is not mention", () => {
  it("does not treat a mentioned name as arriving", () => {
    assert.equal(nameArrivedInText("Kirishima had visited yesterday, then left.", "Kirishima"), false);
    assert.equal(nameArrivedInText("Kirishima walked in carrying protein shakes.", "Kirishima"), true);
  });

  it("extractHeuristic does not put mentioned people into present", () => {
    const out = extractHeuristic({
      storyId: "s1",
      chatId: "c1",
      sourceMessageId: "m1",
      userText: "Reiko thought about Kirishima while sitting with Bakugo.",
      assistantText: "Bakugo clicked his tongue. Kirishima would have laughed.",
      characters: [char("reiko", "Reiko"), char("bakugo", "Bakugo"), char("kiri", "Kirishima")],
    });
    assert.ok(!out.storyStateUpdates.present?.includes("Kirishima"));
  });

  it("tracked empty room keeps the cast absent", () => {
    const bakugo = char("bakugo", "Bakugo");
    const kiri = char("kiri", "Kirishima");
    const pack = retrieveContext(
      {
        story: story({ characterIds: ["bakugo", "kiri"] }),
        characters: [bakugo, kiri],
        lore: [],
        memories: [],
        relationships: [],
        storyState: {
          location: "Hospital",
          scene: "Empty for a moment",
          presentCharacterIds: [],
          time: "",
          goals: "",
          tension: "",
          recentEvents: "",
          emotionalState: "",
          updatedAt: 1,
          tracked: true,
        },
        transcript: [],
      },
      "The room is quiet.",
    );
    assert.equal(pack.characters.length, 0);
    assert.ok(pack.absentCharacters.some((c) => c.id === "kiri"));
    assert.ok(pack.absentCharacters.some((c) => c.id === "bakugo"));
  });
});

describe("Ollama context vs reply length", () => {
  it("sends num_ctx separately from num_predict", () => {
    const options = ollamaChatOptions({
      provider: "ollama",
      messages: [],
      maxTokens: 900,
      numCtx: 24000,
      temperature: 0.85,
      topP: 0.95,
    });
    assert.equal(options.num_ctx, 24000);
    assert.equal(options.num_predict, 900);
    assert.notEqual(options.num_ctx, options.num_predict);
  });
});
