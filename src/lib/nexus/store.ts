import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { ImportedBundle } from "./import-export.ts";
import { nid, now } from "./ids.ts";
import { capLogs, makeLog } from "./logger.ts";
import { defaultPresetMap } from "./presets.ts";
import { buildSeed } from "./seed.ts";
import type {
  AppSettings,
  Character,
  Chat,
  ChatMessage,
  GenerationPreset,
  GenerationTrace,
  LogEntry,
  Lorebook,
  LoreEntry,
  Memory,
  Persona,
  Relationship,
  Secret,
  Story,
  StoryState,
  World,
} from "./types.ts";

export type NexusState = {
  stories: Record<string, Story>;
  characters: Record<string, Character>;
  personas: Record<string, Persona>;
  worlds: Record<string, World>;
  lorebooks: Record<string, Lorebook>;
  lore: Record<string, LoreEntry>;
  relationships: Record<string, Relationship>;
  memories: Record<string, Memory>;
  secrets: Record<string, Secret>;
  chats: Record<string, Chat>;
  messages: Record<string, ChatMessage>;
  storyStates: Record<string, StoryState>;
  presets: Record<string, GenerationPreset>;
  settings: AppSettings;
  logs: LogEntry[];
  lastTrace?: GenerationTrace;
  seeded: boolean;
};

export type NexusActions = {
  log: (message: string, data?: Record<string, unknown>, level?: LogEntry["level"]) => void;
  setTrace: (trace: GenerationTrace) => void;
  patchSettings: (patch: Partial<AppSettings>) => void;
  upsertStory: (story: Story) => void;
  deleteStory: (id: string) => void;
  touchStory: (id: string) => void;
  upsertCharacter: (character: Character) => void;
  deleteCharacter: (id: string) => void;
  upsertPersona: (persona: Persona) => void;
  deletePersona: (id: string) => void;
  upsertWorld: (world: World) => void;
  upsertLorebook: (book: Lorebook) => void;
  deleteLorebook: (id: string) => void;
  upsertLore: (entry: LoreEntry) => void;
  deleteLore: (id: string) => void;
  upsertRelationship: (rel: Relationship) => void;
  upsertMemory: (memory: Memory) => void;
  patchMemory: (id: string, patch: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  upsertSecret: (secret: Secret) => void;
  setStoryState: (storyId: string, state: StoryState) => void;
  upsertChat: (chat: Chat) => void;
  upsertMessage: (message: ChatMessage) => void;
  setChat: (chat: Chat) => void;
  upsertPreset: (preset: GenerationPreset) => void;
  importBundle: (partial: Partial<NexusState>) => void;
  commitImport: (bundle: ImportedBundle, opts?: { storyId?: string }) => { storyId?: string; firstId?: string };
};

const empty = (): NexusState => ({
  stories: {},
  characters: {},
  personas: {},
  worlds: {},
  lorebooks: {},
  lore: {},
  relationships: {},
  memories: {},
  secrets: {},
  chats: {},
  messages: {},
  storyStates: {},
  presets: defaultPresetMap(),
  settings: buildSeed().settings,
  logs: [],
  seeded: false,
});

function initial(): NexusState {
  const seed = buildSeed();
  return {
    ...empty(),
    ...seed,
    relationships: {},
    memories: {},
    secrets: {},
    logs: [],
    seeded: true,
  };
}

function uniq(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

function memoryStorage() {
  const mem: Record<string, string> = {};
  return {
    getItem: (k: string) => mem[k] ?? null,
    setItem: (k: string, v: string) => {
      mem[k] = v;
    },
    removeItem: (k: string) => {
      delete mem[k];
    },
  };
}

function safeStorage() {
  if (typeof window === "undefined") return memoryStorage();
  try {
    const probe = "__nexus_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return memoryStorage();
  }
}

function nonempty<T>(rec?: Record<string, T> | null): rec is Record<string, T> {
  return !!rec && Object.keys(rec).length > 0;
}

function hydrateFrom(s: Partial<NexusState>, current?: NexusState): NexusState {
  const seed = buildSeed();
  const base: NexusState = current ?? {
    ...empty(),
    ...seed,
    relationships: {},
    memories: {},
    secrets: {},
    logs: [],
    seeded: true,
  };
  return {
    ...base,
    ...s,
    characters: nonempty(s.characters) ? s.characters : base.characters,
    worlds: nonempty(s.worlds) ? s.worlds : base.worlds,
    personas: nonempty(s.personas) ? s.personas : base.personas,
    lorebooks: nonempty(s.lorebooks) ? s.lorebooks : base.lorebooks,
    lore: nonempty(s.lore) ? s.lore : base.lore,
    stories: nonempty(s.stories) ? s.stories : base.stories,
    chats: nonempty(s.chats) ? s.chats : base.chats,
    messages: nonempty(s.messages) ? s.messages : base.messages,
    presets: nonempty(s.presets) ? s.presets : base.presets,
    settings: s.settings ?? base.settings,
    relationships: s.relationships ?? base.relationships ?? {},
    memories: s.memories ?? base.memories ?? {},
    secrets: s.secrets ?? base.secrets ?? {},
    storyStates: nonempty(s.storyStates) ? s.storyStates : base.storyStates,
    logs: [],
    seeded: true,
  };
}

export const useNexus = create<NexusState & NexusActions>()(
  persist(
    (set, get) => ({
      ...initial(),
      log: (message, data, level = "info") =>
        set({ logs: capLogs([...get().logs, makeLog(message, data, level)]) }),
      setTrace: (trace) => set({ lastTrace: trace }),
      patchSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      upsertStory: (story) =>
        set({
          stories: {
            ...get().stories,
            [story.id]: { ...story, lorebookIds: story.lorebookIds ?? [], updatedAt: now() },
          },
        }),
      deleteStory: (id) => {
        const stories = { ...get().stories };
        const story = stories[id];
        delete stories[id];
        const chats = { ...get().chats };
        const messages = { ...get().messages };
        if (story) {
          delete chats[story.chatId];
          for (const m of Object.values(messages)) {
            if (m.chatId === story.chatId) delete messages[m.id];
          }
        }
        const memories = { ...get().memories };
        for (const m of Object.values(memories)) {
          if (m.storyId === id) delete memories[m.id];
        }
        set({ stories, chats, messages, memories });
      },
      touchStory: (id) => {
        const story = get().stories[id];
        if (!story) return;
        set({ stories: { ...get().stories, [id]: { ...story, updatedAt: now() } } });
      },
      upsertCharacter: (character) =>
        set({ characters: { ...get().characters, [character.id]: character } }),
      deleteCharacter: (id) => {
        const characters = { ...get().characters };
        delete characters[id];
        const stories = { ...get().stories };
        for (const story of Object.values(stories)) {
          if (story.characterIds.includes(id)) {
            stories[story.id] = {
              ...story,
              characterIds: story.characterIds.filter((cid) => cid !== id),
              updatedAt: now(),
            };
          }
        }
        set({ characters, stories });
      },
      upsertPersona: (persona) => {
        const personas = { ...get().personas };
        if (persona.isDefault) {
          for (const existing of Object.values(personas)) {
            if (existing.id !== persona.id && existing.isDefault) {
              personas[existing.id] = { ...existing, isDefault: false };
            }
          }
        }
        personas[persona.id] = { ...persona, tags: persona.tags ?? [], updatedAt: now() };
        set({ personas });
      },
      deletePersona: (id) => {
        const personas = { ...get().personas };
        delete personas[id];
        const stories = { ...get().stories };
        for (const story of Object.values(stories)) {
          if (story.personaId === id) {
            stories[story.id] = { ...story, personaId: undefined, updatedAt: now() };
          }
        }
        set({ personas, stories });
      },
      upsertWorld: (world) => set({ worlds: { ...get().worlds, [world.id]: world } }),
      upsertLorebook: (book) =>
        set({ lorebooks: { ...get().lorebooks, [book.id]: { ...book, updatedAt: now() } } }),
      deleteLorebook: (id) => {
        const lorebooks = { ...get().lorebooks };
        delete lorebooks[id];
        const lore = { ...get().lore };
        for (const entry of Object.values(lore)) {
          if (entry.lorebookId === id) delete lore[entry.id];
        }
        const stories = { ...get().stories };
        for (const story of Object.values(stories)) {
          if (story.lorebookIds?.includes(id)) {
            stories[story.id] = {
              ...story,
              lorebookIds: story.lorebookIds.filter((bid) => bid !== id),
              updatedAt: now(),
            };
          }
        }
        set({ lorebooks, lore, stories });
      },
      upsertLore: (entry) => set({ lore: { ...get().lore, [entry.id]: entry } }),
      deleteLore: (id) => {
        const lore = { ...get().lore };
        delete lore[id];
        const stories = { ...get().stories };
        for (const story of Object.values(stories)) {
          if (story.loreIds.includes(id)) {
            stories[story.id] = {
              ...story,
              loreIds: story.loreIds.filter((lid) => lid !== id),
              updatedAt: now(),
            };
          }
        }
        set({ lore, stories });
      },
      upsertRelationship: (rel) =>
        set({ relationships: { ...get().relationships, [rel.id]: rel } }),
      upsertMemory: (memory) =>
        set({ memories: { ...get().memories, [memory.id]: memory } }),
      patchMemory: (id, patch) => {
        const prev = get().memories[id];
        if (!prev) return;
        set({
          memories: {
            ...get().memories,
            [id]: { ...prev, ...patch, updatedAt: now(), manuallyEdited: true },
          },
        });
      },
      deleteMemory: (id) => {
        const prev = get().memories[id];
        if (!prev) return;
        set({
          memories: {
            ...get().memories,
            [id]: { ...prev, status: "deleted", updatedAt: now() },
          },
        });
      },
      upsertSecret: (secret) => set({ secrets: { ...get().secrets, [secret.id]: secret } }),
      setStoryState: (storyId, state) =>
        set({ storyStates: { ...get().storyStates, [storyId]: state } }),
      upsertChat: (chat) => set({ chats: { ...get().chats, [chat.id]: chat } }),
      upsertMessage: (message) =>
        set({ messages: { ...get().messages, [message.id]: message } }),
      setChat: (chat) => set({ chats: { ...get().chats, [chat.id]: chat } }),
      upsertPreset: (preset) => set({ presets: { ...get().presets, [preset.id]: preset } }),
      importBundle: (partial) =>
        set({
          characters: { ...get().characters, ...(partial.characters ?? {}) },
          lore: { ...get().lore, ...(partial.lore ?? {}) },
          lorebooks: { ...get().lorebooks, ...(partial.lorebooks ?? {}) },
          personas: { ...get().personas, ...(partial.personas ?? {}) },
          worlds: { ...get().worlds, ...(partial.worlds ?? {}) },
          stories: { ...get().stories, ...(partial.stories ?? {}) },
          chats: { ...get().chats, ...(partial.chats ?? {}) },
          messages: { ...get().messages, ...(partial.messages ?? {}) },
        }),
      commitImport: (bundle, opts) => {
        const characters = { ...get().characters };
        const personas = { ...get().personas };
        const lore = { ...get().lore };
        const lorebooks = { ...get().lorebooks };
        const stories = { ...get().stories };

        for (const c of bundle.characters) characters[c.id] = c;
        for (const p of bundle.personas) {
          if (p.isDefault) {
            for (const existing of Object.values(personas)) {
              if (existing.isDefault) personas[existing.id] = { ...existing, isDefault: false };
            }
          }
          personas[p.id] = { ...p, tags: p.tags ?? [] };
        }
        for (const book of bundle.lorebooks) lorebooks[book.id] = book;
        for (const entry of bundle.lore) lore[entry.id] = entry;

        let storyId = opts?.storyId;
        if (storyId && stories[storyId]) {
          const story = stories[storyId];
          stories[storyId] = {
            ...story,
            characterIds: uniq([...story.characterIds, ...bundle.characters.map((c) => c.id)]),
            lorebookIds: uniq([...(story.lorebookIds ?? []), ...bundle.lorebooks.map((b) => b.id)]),
            loreIds: uniq([...story.loreIds, ...bundle.lore.map((l) => l.id)]),
            personaId: story.personaId || bundle.personas[0]?.id,
            updatedAt: now(),
          };
        }

        set({ characters, personas, lore, lorebooks, stories });
        return {
          storyId,
          firstId:
            bundle.personas[0]?.id ||
            bundle.lorebooks[0]?.id ||
            bundle.characters[0]?.id ||
            bundle.lore[0]?.id,
        };
      },
    }),
    {
      name: "nexus-store-v1",
      version: 4,
      migrate: (persisted) => migratePersisted(persisted),
      merge: (persisted, current) => ({
        ...current,
        ...hydrateFrom((persisted ?? {}) as Partial<NexusState>, current),
      }),
      storage: createJSONStorage(() => safeStorage()),
      partialize: (s) => ({
        stories: s.stories,
        characters: s.characters,
        personas: s.personas,
        worlds: s.worlds,
        lorebooks: s.lorebooks,
        lore: s.lore,
        relationships: s.relationships,
        memories: s.memories,
        secrets: s.secrets,
        chats: s.chats,
        messages: s.messages,
        storyStates: s.storyStates,
        presets: s.presets,
        settings: s.settings,
        seeded: s.seeded,
      }),
    },
  ),
);

function migratePersisted(persisted: unknown): NexusState {
  const s = (persisted ?? {}) as Partial<NexusState>;
  const lorebooks = { ...(s.lorebooks ?? {}) };
  const lore = { ...(s.lore ?? {}) };
  const personas = { ...(s.personas ?? {}) };
  const stories = { ...(s.stories ?? {}) };

  for (const persona of Object.values(personas)) {
    personas[persona.id] = {
      ...persona,
      tags: persona.tags ?? [],
      isDefault: persona.isDefault ?? false,
    };
  }

  for (const entry of Object.values(lore)) {
    lore[entry.id] = {
      ...entry,
      always: entry.always ?? false,
      preventRecursion: entry.preventRecursion ?? false,
    };
  }

  for (const story of Object.values(stories)) {
    stories[story.id] = { ...story, lorebookIds: story.lorebookIds ?? [] };
  }

  const storyStates = { ...(s.storyStates ?? {}) };
  for (const [id, st] of Object.entries(storyStates)) {
    storyStates[id] = {
      ...st,
      tracked: st.tracked ?? (st.presentCharacterIds?.length ?? 0) > 0,
    };
  }

  if (Object.keys(lorebooks).length === 0) {
    const worlds = s.worlds ?? {};
    for (const world of Object.values(worlds)) {
      const id = `book-${world.id}`;
      lorebooks[id] = {
        id,
        name: world.name,
        description: (world.description ?? "").slice(0, 180),
        tags: [],
        enabled: true,
        global: false,
        createdAt: world.createdAt,
        updatedAt: world.updatedAt,
      };
    }
    for (const entry of Object.values(lore)) {
      if (entry.worldId && !entry.lorebookId) {
        lore[entry.id] = { ...entry, lorebookId: `book-${entry.worldId}` };
      }
    }
    for (const story of Object.values(stories)) {
      if (story.worldId && lorebooks[`book-${story.worldId}`]) {
        const bid = `book-${story.worldId}`;
        if (!(story.lorebookIds ?? []).includes(bid)) {
          stories[story.id] = {
            ...story,
            lorebookIds: [...(story.lorebookIds ?? []), bid],
          };
        }
      }
    }
  }

  return hydrateFrom({
    ...s,
    lorebooks,
    lore,
    personas,
    stories,
    storyStates,
  });
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(() =>
    typeof window === "undefined" ? true : useNexus.persist.hasHydrated(),
  );
  useEffect(() => {
    const unsub = useNexus.persist.onFinishHydration(() => setHydrated(true));
    if (useNexus.persist.hasHydrated()) setHydrated(true);
    const t = window.setTimeout(() => setHydrated(true), 600);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, []);
  return hydrated;
}

export function createBlankCharacter(name: string): Character {
  const t = now();
  return {
    id: nid(),
    name,
    aliases: [],
    description: "",
    personality: "",
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

export function createBlankPersona(name: string): Persona {
  const t = now();
  return {
    id: nid(),
    name,
    appearance: "",
    personality: "",
    background: "",
    behavior: "",
    speechStyle: "",
    preferences: "",
    abilities: "",
    tags: [],
    isDefault: false,
    createdAt: t,
    updatedAt: t,
  };
}

export function createBlankWorld(name: string): World {
  const t = now();
  return {
    id: nid(),
    name,
    description: "",
    greeting: "",
    createdAt: t,
    updatedAt: t,
  };
}

export function createBlankLorebook(name: string): Lorebook {
  const t = now();
  return {
    id: nid(),
    name,
    description: "",
    tags: [],
    enabled: true,
    global: false,
    createdAt: t,
    updatedAt: t,
  };
}

export function createBlankLoreEntry(lorebookId: string, title = "New entry"): LoreEntry {
  return {
    id: nid(),
    lorebookId,
    title,
    content: "",
    keywords: [],
    aliases: [],
    category: "general",
    priority: 10,
    importance: 0.5,
    enabled: true,
    always: false,
    preventRecursion: false,
    createdAt: now(),
  };
}

export function createStoryDraft(name: string): { story: Story; chat: Chat } {
  const t = now();
  const id = nid();
  const chatId = nid();
  return {
    story: {
      id,
      name,
      description: "",
      characterIds: [],
      loreIds: [],
      lorebookIds: [],
      presetIds: ["preset-slow-burn"],
      chatId,
      autoMemories: true,
      autoCharacters: true,
      memoryMatrix: true,
      loreActivation: "smart",
      contextSize: 24000,
      createdAt: t,
      updatedAt: t,
    },
    chat: {
      id: chatId,
      storyId: id,
      rootMessageId: null,
      activeLeafId: null,
      canonLeafId: null,
    },
  };
}

export function defaultPersonaId(personas: Record<string, Persona>): string | undefined {
  const list = Object.values(personas);
  return list.find((p) => p.isDefault)?.id ?? list[0]?.id;
}
