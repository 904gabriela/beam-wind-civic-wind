import { CHARACTERS, withOpeningChoices } from "@/lib/characters";
import { nid, now } from "./ids.ts";
import { defaultPresetMap } from "./presets.ts";
import type {
  AppSettings,
  Character,
  Chat,
  ChatMessage,
  Lorebook,
  LoreEntry,
  Persona,
  Story,
  StoryState,
  World,
} from "./types.ts";

export type SeedBundle = {
  stories: Record<string, Story>;
  characters: Record<string, Character>;
  personas: Record<string, Persona>;
  worlds: Record<string, World>;
  lorebooks: Record<string, Lorebook>;
  lore: Record<string, LoreEntry>;
  chats: Record<string, Chat>;
  messages: Record<string, ChatMessage>;
  storyStates: Record<string, StoryState>;
  presets: ReturnType<typeof defaultPresetMap>;
  settings: AppSettings;
};

export function buildSeed(): SeedBundle {
  const t = now();
  const characters: Record<string, Character> = {};
  const worlds: Record<string, World> = {};

  for (const c of CHARACTERS) {
    if (c.kind === "world") {
      worlds[c.id] = {
        id: c.id,
        name: c.name,
        description: `${c.bio}\n\nVoice: ${c.personality}\n\nOpening scene: ${c.premise}`,
        image: c.image,
        greeting: withOpeningChoices(c.greeting, c.openingChoices),
        createdAt: t,
        updatedAt: t,
      };
      continue;
    }
    characters[c.id] = {
      id: c.id,
      name: c.name,
      aliases: c.handle ? [c.handle] : [],
      description: c.bio,
      personality: c.personality,
      appearance: "",
      background: c.bio,
      history: "",
      behavior: c.personality,
      speechStyle: "",
      likes: "",
      dislikes: "",
      fears: "",
      goals: "",
      secrets: "",
      abilities: "",
      scenario: c.premise,
      exampleDialogue: c.greeting,
      systemInstructions: "",
      creatorNotes: c.tagline,
      tags: c.tags,
      image: c.image,
      origin: "manual",
      observedFacts: [],
      confidence: 1,
      createdAt: t,
      updatedAt: t,
    };
  }

  const personaId = "persona-you";
  const personas: Record<string, Persona> = {
    [personaId]: {
      id: personaId,
      name: "You",
      appearance: "",
      personality: "A traveler who walks into stories as if they were rooms.",
      background: "",
      behavior: "Present, curious, not a narrator. Speak as yourself.",
      speechStyle: "",
      preferences: "",
      abilities: "",
      tags: [],
      isDefault: true,
      createdAt: t,
      updatedAt: t,
    },
  };

  const lorebooks: Record<string, Lorebook> = {
    "book-ember": {
      id: "book-ember",
      name: "The Ember",
      description: "House rules of the tavern that appears for a second last call.",
      tags: ["tavern"],
      enabled: true,
      global: false,
      createdAt: t,
      updatedAt: t,
    },
    "book-night": {
      id: "book-night",
      name: "The Night Line",
      description: "Facts the conductor will not volunteer.",
      tags: ["train"],
      enabled: true,
      global: false,
      createdAt: t,
      updatedAt: t,
    },
    "book-harbor": {
      id: "book-harbor",
      name: "Glass Harbor",
      description: "Lantern night and the names the water keeps.",
      tags: ["harbor"],
      enabled: true,
      global: false,
      createdAt: t,
      updatedAt: t,
    },
  };

  const lore: Record<string, LoreEntry> = {};
  const addLore = (
    lorebookId: string,
    worldId: string,
    title: string,
    content: string,
    keywords: string[],
    always = false,
    category = "world",
  ) => {
    const id = nid();
    lore[id] = {
      id,
      lorebookId,
      worldId,
      title,
      content,
      keywords,
      aliases: [],
      category,
      priority: 12,
      importance: 0.7,
      enabled: true,
      always,
      createdAt: t,
    };
    return id;
  };

  const emberLore = [
    addLore(
      "book-ember",
      "ember-tavern",
      "The Ember",
      "The Ember is a tavern that appears when someone needs a second last call. The door is never where it was yesterday.",
      ["ember", "tavern", "door", "last call"],
    ),
    addLore(
      "book-ember",
      "ember-tavern",
      "House rule",
      "First drink is on the weather. Second is on you. Names given at the Ember are kept.",
      ["drink", "weather", "house rule", "bar", "name"],
      true,
      "custom",
    ),
    addLore(
      "book-ember",
      "ember-tavern",
      "The piano",
      "Mira Vale is the house pianist. Regulars swear she hears a story in how someone sits down.",
      ["piano", "mira", "song", "music"],
      false,
      "character",
    ),
  ];
  const nightLore = [
    addLore(
      "book-night",
      "night-line",
      "The Night Line",
      "A vintage train that only stops for people who missed the last one. Destinations are a negotiation.",
      ["train", "ticket", "carriage", "conductor"],
    ),
  ];
  addLore(
    "book-harbor",
    "glass-harbor",
    "Lantern festival",
    "Once a year Glass Harbor writes names on paper lights and lets them go over the water.",
    ["lantern", "harbor", "festival", "name"],
    false,
    "event",
  );

  const stories: Record<string, Story> = {};
  const chats: Record<string, Chat> = {};
  const messages: Record<string, ChatMessage> = {};
  const storyStates: Record<string, StoryState> = {};

  function makeStory(opts: {
    id: string;
    name: string;
    description: string;
    image?: string;
    characterIds: string[];
    worldId?: string;
    loreIds: string[];
    lorebookIds?: string[];
    presetIds: string[];
    greeting: string;
    state: Omit<StoryState, "updatedAt">;
  }) {
    const chatId = `chat-${opts.id}`;
    const greetId = `greet-${opts.id}`;
    stories[opts.id] = {
      id: opts.id,
      name: opts.name,
      description: opts.description,
      image: opts.image,
      characterIds: opts.characterIds,
      personaId,
      worldId: opts.worldId,
      loreIds: opts.loreIds,
      lorebookIds: opts.lorebookIds ?? [],
      presetIds: opts.presetIds,
      chatId,
      autoMemories: true,
      autoCharacters: true,
      memoryMatrix: true,
      loreActivation: "smart",
      contextSize: 24000,
      createdAt: t,
      updatedAt: t,
    };
    chats[chatId] = {
      id: chatId,
      storyId: opts.id,
      rootMessageId: greetId,
      activeLeafId: greetId,
      canonLeafId: greetId,
    };
    messages[greetId] = {
      id: greetId,
      chatId,
      parentId: null,
      role: "assistant",
      content: opts.greeting,
      createdAt: t,
    };
    storyStates[opts.id] = { ...opts.state, updatedAt: t };
  }

  const mira = CHARACTERS.find((c) => c.id === "mira")!;
  const night = CHARACTERS.find((c) => c.id === "night-line")!;
  const kai = CHARACTERS.find((c) => c.id === "kai")!;

  makeStory({
    id: "story-ember",
    name: "Last Call at The Ember",
    description:
      "A tavern that appears when you need a second last call. Mira at the piano, Aiko behind the bar, Dante pretending not to listen.",
    image: "/worlds/ember.jpg",
    characterIds: ["mira", "aiko", "dante"],
    worldId: "ember-tavern",
    loreIds: emberLore,
    lorebookIds: ["book-ember"],
    presetIds: ["preset-slow-burn", "preset-detailed"],
    greeting: withOpeningChoices(mira.greeting, mira.openingChoices),
    state: {
      location: "The Ember",
      scene: "Last call, rain on the windows",
      presentCharacterIds: ["mira", "aiko"],
      time: "Late",
      goals: "",
      tension: "A new regular just walked in",
      recentEvents: "The door opened on a street that did not have a door this morning.",
      emotionalState: "Quiet, watchful",
      tracked: true,
    },
  });

  makeStory({
    id: "story-pass",
    name: "The Closing Pass",
    description:
      "Fog thick enough to swallow the trail. Kai Ren offers the last dry place under the overhang — and does not ask who you used to be.",
    image: "/characters/kai.jpg",
    characterIds: ["kai"],
    loreIds: [],
    lorebookIds: [],
    presetIds: ["preset-cinematic"],
    greeting: withOpeningChoices(kai.greeting, kai.openingChoices),
    state: {
      location: "Mountain pass overhang",
      scene: "Dusk, fog, a new fire",
      presentCharacterIds: ["kai"],
      time: "Dusk",
      goals: "Survive the night on the pass",
      tension: "The path behind is already gone",
      recentEvents: "The traveler arrived soaked and late.",
      emotionalState: "Wary, practical",
      tracked: true,
    },
  });

  makeStory({
    id: "story-night",
    name: "The Night Line",
    description:
      "A train that only stops for people who missed the last one. Your ticket has tomorrow's date. The conductor does not mind.",
    image: "/worlds/night-line.jpg",
    characterIds: [],
    worldId: "night-line",
    loreIds: nightLore,
    lorebookIds: ["book-night"],
    presetIds: ["preset-dark", "preset-cinematic"],
    greeting: withOpeningChoices(night.greeting, night.openingChoices),
    state: {
      location: "Night Line carriage",
      scene: "Rain on dark glass, brass lamps",
      presentCharacterIds: [],
      time: "Night",
      goals: "Understand the destination",
      tension: "The ticket is wrong, and still valid",
      recentEvents: "You sat down. The seat across from you was empty, then it was not.",
      emotionalState: "Uncanny calm",
      tracked: true,
    },
  });

  return {
    stories,
    characters,
    personas,
    worlds,
    lorebooks,
    lore,
    chats,
    messages,
    storyStates,
    presets: defaultPresetMap(),
    settings: {
      provider: "xai",
      ollamaBaseUrl: "http://127.0.0.1:11434",
      ollamaModel: "llama3.1",
      openaiBaseUrl: "http://127.0.0.1:11434/v1",
      openaiModel: "llama3.1",
      openaiApiKey: "",
      xaiModel: "grok-4.5",
      debugMode: false,
      autoMemoriesGlobal: true,
      autoCharactersGlobal: true,
    },
  };
}
