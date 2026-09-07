import { streamLlm, completeLlm } from "@/lib/llm/client";
import type { LlmRequest } from "@/lib/llm/types";
import { loreForStory } from "./lorebooks.ts";
import { retrieveContext } from "./context-engine.ts";
import { discoverCharacters, enrichCharacter } from "./discovery.ts";
import { nid, now } from "./ids.ts";
import {
  applyRelationshipUpdates,
  arrivingIdsFromText,
  consolidatePairEvents,
  dedupeMemories,
  extractHeuristic,
  memoriesFromAnalyzer,
  mergeStoryState,
  parseAnalyzerJson,
} from "./memory-engine.ts";
import { composePresets } from "./presets.ts";
import { buildPrompt } from "./prompt-engine.ts";
import { CHARACTERS, withOpeningChoices } from "@/lib/characters";
import { createStoryDraft, defaultPersonaId, useNexus } from "./store.ts";
import { addMessage, childrenOf, pathToRoot, visibleTranscript } from "./chat-tree.ts";
import type { ChatMessage, Character, Story } from "./types.ts";

function requestFromState(
  story: Story,
  messages: LlmRequest["messages"],
  sampling: { temperature: number; topP: number; maxTokens: number; topK?: number; repeatPenalty?: number },
  json = false,
): LlmRequest {
  const settings = useNexus.getState().settings;
  return {
    provider: settings.provider,
    model:
      settings.provider === "xai"
        ? settings.xaiModel
        : settings.provider === "ollama"
          ? settings.ollamaModel
          : settings.openaiModel,
    ollamaBaseUrl: settings.ollamaBaseUrl,
    openaiBaseUrl: settings.openaiBaseUrl,
    openaiApiKey: settings.openaiApiKey,
    temperature: sampling.temperature,
    topP: sampling.topP,
    topK: sampling.topK,
    repeatPenalty: sampling.repeatPenalty,
    maxTokens: json ? 500 : Math.min(sampling.maxTokens, 2000),
    numCtx: story.contextSize || 24000,
    messages,
    json,
  };
}

function packFor(story: Story, userText: string) {
  const s = useNexus.getState();
  const chat = s.chats[story.chatId];
  const transcript = visibleTranscript(chat, s.messages);
  const characters = Object.values(s.characters);
  const lore = loreForStory(story, Object.values(s.lore), Object.values(s.lorebooks));
  return retrieveContext(
    {
      story,
      characters,
      persona: story.personaId ? s.personas[story.personaId] : undefined,
      world: story.worldId ? s.worlds[story.worldId] : undefined,
      lore,
      memories: Object.values(s.memories),
      relationships: Object.values(s.relationships),
      storyState: s.storyStates[story.id],
      transcript,
    },
    userText,
    {
      system: 1500,
      character: 2500,
      persona: 1000,
      lore: 3000,
      memory: 3000,
      storyState: 1000,
      chat: Math.min(12000, Math.max(2000, story.contextSize - 8000)),
      user: 500,
      total: story.contextSize || 24000,
    },
  );
}

function composedFor(story: Story) {
  const s = useNexus.getState();
  const presets = story.presetIds.map((id) => s.presets[id]).filter(Boolean);
  return composePresets(presets);
}

export async function sendTurn(
  storyId: string,
  userText: string,
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<{ assistantId: string }> {
  const text = userText.trim();
  if (!text) throw new Error("Empty message.");
  const s = useNexus.getState();
  const story = s.stories[storyId];
  if (!story) throw new Error("Story not found.");
  let chat = s.chats[story.chatId];
  if (!chat) throw new Error("Chat not found.");

  const userMsg: ChatMessage = {
    id: nid(),
    chatId: chat.id,
    parentId: chat.activeLeafId,
    role: "user",
    content: text,
    createdAt: now(),
  };
  const added = addMessage(s.messages, chat, userMsg);
  s.upsertMessage(userMsg);
  s.setChat(added.chat);
  chat = added.chat;

  const assistantId = nid();
  const placeholder: ChatMessage = {
    id: assistantId,
    chatId: chat.id,
    parentId: userMsg.id,
    role: "assistant",
    content: "",
    createdAt: now(),
  };
  const addedA = addMessage(useNexus.getState().messages, chat, placeholder);
  s.upsertMessage(placeholder);
  s.setChat(addedA.chat);
  s.touchStory(storyId);

  const composed = composedFor(story);
  const pack = packFor(story, text);
  const { messages, trace } = buildPrompt({
    story,
    pack,
    preset: composed,
    userText: text,
  });
  s.setTrace(trace);
  s.log("Generation started", {
    model: useNexus.getState().settings.xaiModel,
    preset: composed.name,
    contextTokens: trace.totalTokens,
    memories: trace.memoryIds.length,
    lore: trace.loreIds.length,
    characters: trace.characterIds.length,
  });

  try {
    const full = await streamLlm(
      requestFromState(story, messages, composed),
      (delta) => {
        onDelta(delta);
        useNexus.getState().upsertMessage({ ...placeholder, content: delta });
      },
      signal,
    );
    const finalText = full || "…";
    useNexus.getState().upsertMessage({ ...placeholder, content: finalText });
    useNexus.getState().log("Generation completed", { tokensOut: Math.ceil(finalText.length / 4) });
    void afterTurn(storyId, userMsg.id, assistantId, text, finalText);
    return { assistantId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    useNexus.getState().log("Generation failed", { error: message }, "error");
    throw err;
  }
}

export async function regenerate(
  storyId: string,
  assistantId: string,
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const s = useNexus.getState();
  const story = s.stories[storyId];
  const original = s.messages[assistantId];
  if (!story || !original || original.role !== "assistant") throw new Error("Nothing to regenerate.");
  const parent = original.parentId;
  const userText =
    (parent && s.messages[parent]?.role === "user" ? s.messages[parent].content : "") ||
    "Continue.";

  const sibling: ChatMessage = {
    id: nid(),
    chatId: original.chatId,
    parentId: original.parentId,
    role: "assistant",
    content: "",
    createdAt: now(),
  };
  const chat = s.chats[story.chatId];
  const added = addMessage(s.messages, chat, sibling);
  s.upsertMessage(sibling);
  s.setChat(added.chat);

  const composed = composedFor(story);
  const pack = packFor(story, userText);
  const { messages, trace } = buildPrompt({ story, pack, preset: composed, userText });
  s.setTrace(trace);
  s.log("Regeneration started", { preset: composed.name });
  const full = await streamLlm(
    requestFromState(story, messages, composed),
    (delta) => {
      onDelta(delta);
      useNexus.getState().upsertMessage({ ...sibling, content: delta });
    },
    signal,
  );
  useNexus.getState().upsertMessage({ ...sibling, content: full || "…" });
  return sibling.id;
}

export function editUserMessage(storyId: string, messageId: string, content: string) {
  const s = useNexus.getState();
  const story = s.stories[storyId];
  const original = s.messages[messageId];
  if (!story || !original || original.role !== "user") return null;
  const next: ChatMessage = {
    id: nid(),
    chatId: original.chatId,
    parentId: original.parentId,
    role: "user",
    content,
    createdAt: now(),
    editedFromId: original.id,
  };
  const chat = s.chats[story.chatId];
  const added = addMessage(s.messages, chat, next);
  s.upsertMessage(next);
  s.setChat(added.chat);
  return next;
}

async function afterTurn(
  storyId: string,
  userMessageId: string,
  assistantId: string,
  userText: string,
  assistantText: string,
) {
  const s = useNexus.getState();
  const story = s.stories[storyId];
  if (!story) return;
  const settings = s.settings;
  const characters = Object.values(s.characters);
  const storyChars = characters.filter((c) => story.characterIds.includes(c.id));
  const lore = Object.values(s.lore);
  const world = story.worldId ? s.worlds[story.worldId] : undefined;

  const heuristic = extractHeuristic({
    storyId,
    chatId: story.chatId,
    sourceMessageId: assistantId,
    userText,
    assistantText,
    characters: storyChars,
    lore,
    world,
  });

  if (story.autoCharacters && settings.autoCharactersGlobal) {
    const found = discoverCharacters({
      text: `${userText}\n${assistantText}`,
      known: characters,
      lore,
      world,
      sourceMessageId: assistantId,
    });
    for (const c of found) {
      useNexus.getState().upsertCharacter(c);
      const st = useNexus.getState().stories[storyId];
      if (st && !st.characterIds.includes(c.id)) {
        useNexus.getState().upsertStory({ ...st, characterIds: [...st.characterIds, c.id] });
      }
      useNexus.getState().log("Character discovered", { name: c.name });
    }
    for (const extra of heuristic.characters) {
      const existing = Object.values(useNexus.getState().characters).find(
        (c) => c.name.toLowerCase() === extra.name.toLowerCase(),
      );
      if (existing && extra.facts[0]) {
        useNexus.getState().upsertCharacter(
          enrichCharacter(existing, extra.facts[0], assistantId),
        );
      }
    }
  }

  if (story.autoMemories && story.memoryMatrix && settings.autoMemoriesGlobal) {
    useNexus.getState().log("Memory extraction started");
    let output = heuristic;
    if (heuristic.memories.some((m) => m.importance >= 0.7)) {
      try {
        const llmOut = await analyzeWithLlm(story, userText, assistantText);
        if (llmOut) output = llmOut;
      } catch {
        /* keep heuristic */
      }
    }
    const incoming = memoriesFromAnalyzer(
      storyId,
      story.chatId,
      assistantId,
      output,
      Object.values(useNexus.getState().characters),
    );
    const existing = Object.values(useNexus.getState().memories).filter((m) => m.storyId === storyId);
    const fresh = dedupeMemories(existing, incoming);
    for (const mem of fresh) useNexus.getState().upsertMemory(mem);
    const all = Object.values(useNexus.getState().memories).filter((m) => m.storyId === storyId);
    const cons = consolidatePairEvents(all);
    if (cons && !all.some((m) => m.type === "consequence" && m.content === cons.content)) {
      useNexus.getState().upsertMemory(cons);
    }
    const resolveId = (name: string) => {
      const n = name.toLowerCase();
      const c = Object.values(useNexus.getState().characters).find(
        (x) => x.name.toLowerCase() === n || x.aliases.some((a) => a.toLowerCase() === n),
      );
      if (c) return c.id;
      const p = Object.values(useNexus.getState().personas).find((x) => x.name.toLowerCase() === n);
      return p?.id;
    };
    const rels = applyRelationshipUpdates(
      Object.values(useNexus.getState().relationships),
      storyId,
      output.relationshipUpdates,
      resolveId,
    );
    for (const r of rels) useNexus.getState().upsertRelationship(r);

    const presentNames = output.storyStateUpdates.present ?? [];
    const currentState = useNexus.getState().storyStates[storyId];
    const arrivedIds = arrivingIdsFromText(
      `${userText}\n${assistantText}`,
      presentNames,
      resolveId,
    );
    const tracked = Boolean(currentState?.tracked) || (currentState?.presentCharacterIds.length ?? 0) > 0;
    const nextPresent = tracked
      ? [...new Set([...(currentState?.presentCharacterIds ?? []), ...arrivedIds])]
      : arrivedIds.length
        ? arrivedIds
        : currentState?.presentCharacterIds ?? [];
    const nextState = mergeStoryState(
      currentState,
      output.storyStateUpdates,
      nextPresent,
      tracked || arrivedIds.length > 0,
    );
    useNexus.getState().setStoryState(storyId, nextState);
    useNexus.getState().log("Memory extraction completed", {
      candidates: output.memories.length,
      committed: fresh.length,
    });
  }
}

async function analyzeWithLlm(story: Story, userText: string, assistantText: string) {
  const names = story.characterIds
    .map((id) => useNexus.getState().characters[id]?.name)
    .filter(Boolean)
    .join(", ");
  const raw = await completeLlm(
    requestFromState(
      story,
      [
        {
          role: "system",
          content: `Extract structured story memory from a roleplay turn. Return ONLY JSON:
{"memories":[{"type":"event|fact|promise|secret|relationship_event|conflict|goal|discovery","subjects":["Name"],"content":"one sentence","importance":0-1,"confidence":0-1,"relationshipImpact":0-1,"observation":true}],"characters":[{"name":"","facts":[],"confidence":0-1}],"relationshipUpdates":[{"a":"","b":"","state":"","note":"","confidence":0-1}],"storyStateUpdates":{"location":"","scene":"","present":[],"recentEvents":"","emotionalState":""}}
Rules: only clearly supported facts. Observations high confidence. Inferences below 0.5. Ignore trivia (dropped objects, idle motion). Known characters: ${names || "none"}.`,
        },
        {
          role: "user",
          content: `USER:\n${userText}\n\nASSISTANT:\n${assistantText}`,
        },
      ],
      { temperature: 0.2, topP: 0.9, maxTokens: 500 },
      true,
    ),
  );
  return parseAnalyzerJson(raw);
}

export function openStoryForCharacter(characterId: string): string {
  const s = useNexus.getState();
  const existing = Object.values(s.stories)
    .filter((st) => st.characterIds.length === 1 && st.characterIds[0] === characterId && !st.worldId)
    .sort((a, b) => b.updatedAt - a.updatedAt)[0];
  if (existing) {
    s.touchStory(existing.id);
    return existing.id;
  }
  const character = s.characters[characterId];
  if (!character) throw new Error("Character not found.");
  const catalog = CHARACTERS.find((c) => c.id === characterId);
  const { story, chat } = createStoryDraft(character.name);
  const next = {
    ...story,
    description: character.creatorNotes || character.description,
    characterIds: [characterId],
    personaId: defaultPersonaId(s.personas),
    image: character.image,
    presetIds: ["preset-slow-burn"],
  };
  s.upsertChat(chat);
  s.upsertStory(next);
  ensureGreeting(
    next,
    withOpeningChoices(character.exampleDialogue || catalog?.greeting || "", catalog?.openingChoices),
  );
  return next.id;
}

export function openStoryForWorld(worldId: string): string {
  const s = useNexus.getState();
  const existing = Object.values(s.stories)
    .filter((st) => st.worldId === worldId)
    .sort((a, b) => b.updatedAt - a.updatedAt)[0];
  if (existing) {
    s.touchStory(existing.id);
    return existing.id;
  }
  const world = s.worlds[worldId];
  if (!world) throw new Error("World not found.");
  const catalog = CHARACTERS.find((c) => c.id === worldId);
  const { story, chat } = createStoryDraft(world.name);
  const bookId = Object.values(s.lorebooks).find(
    (b) => b.id === `book-${worldId}` || b.name === world.name,
  )?.id;
  const next = {
    ...story,
    description: catalog?.tagline || world.description.slice(0, 180),
    worldId,
    image: world.image,
    personaId: defaultPersonaId(s.personas),
    lorebookIds: bookId ? [bookId] : [],
    presetIds: ["preset-slow-burn"],
  };
  s.upsertChat(chat);
  s.upsertStory(next);
  ensureGreeting(
    next,
    withOpeningChoices(world.greeting || catalog?.greeting || "", catalog?.openingChoices),
  );
  return next.id;
}

export function ensureGreeting(story: Story, greeting: string) {
  const s = useNexus.getState();
  const chat = s.chats[story.chatId];
  if (!chat || chat.rootMessageId) return;
  if (!greeting.trim()) return;
  const msg: ChatMessage = {
    id: nid(),
    chatId: chat.id,
    parentId: null,
    role: "assistant",
    content: greeting.trim(),
    createdAt: now(),
  };
  const added = addMessage(s.messages, chat, msg);
  s.upsertMessage(msg);
  s.setChat({ ...added.chat, canonLeafId: msg.id });
}

export function branchMap(storyId: string) {
  const s = useNexus.getState();
  const story = s.stories[storyId];
  if (!story) return [];
  const chat = s.chats[story.chatId];
  if (!chat) return [];
  const root = chat.rootMessageId ? s.messages[chat.rootMessageId] : null;
  if (!root) return [];
  const walk = (id: string, depth: number): { id: string; depth: number; role: string; preview: string; active: boolean }[] => {
    const m = s.messages[id];
    if (!m) return [];
    const activePath = new Set(pathToRoot(s.messages, chat.activeLeafId).map((x) => x.id));
    const kids = childrenOf(s.messages, id, chat.id);
    return [
      {
        id: m.id,
        depth,
        role: m.role,
        preview: m.content.replace(/\s+/g, " ").slice(0, 90),
        active: activePath.has(m.id),
      },
      ...kids.flatMap((k) => walk(k.id, depth + 1)),
    ];
  };
  return walk(root.id, 0);
}
