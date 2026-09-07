export type Id = string;

export type CharacterOrigin = "manual" | "imported" | "discovered";

export type ObservedFact = {
  id: Id;
  content: string;
  sourceMessageId?: Id;
  confidence: number;
  createdAt: number;
};

export type Character = {
  id: Id;
  name: string;
  aliases: string[];
  description: string;
  personality: string;
  appearance: string;
  background: string;
  history: string;
  behavior: string;
  speechStyle: string;
  likes: string;
  dislikes: string;
  fears: string;
  goals: string;
  secrets: string;
  abilities: string;
  scenario: string;
  exampleDialogue: string;
  systemInstructions: string;
  creatorNotes: string;
  tags: string[];
  image?: string;
  origin: CharacterOrigin;
  observedFacts: ObservedFact[];
  confidence: number;
  createdAt: number;
  updatedAt: number;
};

export type Persona = {
  id: Id;
  name: string;
  appearance: string;
  personality: string;
  background: string;
  behavior: string;
  speechStyle: string;
  preferences: string;
  abilities: string;
  tags: string[];
  image?: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
};

export type World = {
  id: Id;
  name: string;
  description: string;
  image?: string;
  greeting?: string;
  createdAt: number;
  updatedAt: number;
};

export type Lorebook = {
  id: Id;
  name: string;
  description: string;
  tags: string[];
  enabled: boolean;
  global: boolean;
  createdAt: number;
  updatedAt: number;
};

export type LoreEntry = {
  id: Id;
  lorebookId?: Id;
  worldId?: Id;
  storyId?: Id;
  title: string;
  content: string;
  keywords: string[];
  aliases: string[];
  category: string;
  priority: number;
  importance: number;
  enabled: boolean;
  always: boolean;
  /** If true, this entry cannot be pulled in by another entry's content. */
  preventRecursion?: boolean;
  createdAt: number;
};

export type Relationship = {
  id: Id;
  storyId: Id;
  aId: Id;
  bId: Id;
  label: string;
  history: string[];
  currentState: string;
  confidence: number;
  updatedAt: number;
};

export type MemoryType =
  | "character"
  | "relationship"
  | "event"
  | "fact"
  | "location"
  | "object"
  | "promise"
  | "secret"
  | "emotional_state"
  | "possession"
  | "goal"
  | "conflict"
  | "consequence"
  | "decision"
  | "discovery"
  | "relationship_event";

export type MemoryStatus = "committed" | "soft" | "rejected" | "deleted";

export type Memory = {
  id: Id;
  storyId: Id;
  type: MemoryType;
  content: string;
  summary: string;
  subjects: string[];
  characterIds: Id[];
  importance: number;
  confidence: number;
  relationshipImpact: number;
  emotionalSignificance: number;
  observation: boolean;
  sourceMessageId?: Id;
  sourceChatId?: Id;
  pinned: boolean;
  manuallyEdited: boolean;
  status: MemoryStatus;
  createdAt: number;
  updatedAt: number;
  lastRetrievedAt?: number;
  retrievalCount: number;
};

export type Secret = {
  id: Id;
  storyId: Id;
  content: string;
  knownBy: Id[];
  unknownTo: Id[];
  sourceMemoryId?: Id;
};

export type StoryState = {
  location: string;
  scene: string;
  presentCharacterIds: Id[];
  time: string;
  goals: string;
  tension: string;
  recentEvents: string;
  emotionalState: string;
  updatedAt: number;
  /**
   * When true, presentCharacterIds is the scene (empty = empty room).
   * When false/absent, the full cast is treated as present.
   */
  tracked?: boolean;
};

export type MessageRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: Id;
  chatId: Id;
  parentId: Id | null;
  role: MessageRole;
  content: string;
  createdAt: number;
  editedFromId?: Id;
};

export type Chat = {
  id: Id;
  storyId: Id;
  rootMessageId: Id | null;
  activeLeafId: Id | null;
  canonLeafId: Id | null;
};

export type GenerationPreset = {
  id: Id;
  name: string;
  builtin: boolean;
  instructions: string;
  temperature: number;
  topP: number;
  topK?: number;
  minP?: number;
  repeatPenalty?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  maxTokens: number;
};

export type LoreActivation = "smart" | "all" | "off";

export type Story = {
  id: Id;
  name: string;
  description: string;
  image?: string;
  characterIds: Id[];
  personaId?: Id;
  worldId?: Id;
  loreIds: Id[];
  lorebookIds: Id[];
  presetIds: Id[];
  chatId: Id;
  autoMemories: boolean;
  autoCharacters: boolean;
  memoryMatrix: boolean;
  loreActivation: LoreActivation;
  contextSize: number;
  createdAt: number;
  updatedAt: number;
};

export type ProviderKind = "xai" | "ollama" | "openai-compatible";

export type AppSettings = {
  provider: ProviderKind;
  ollamaBaseUrl: string;
  ollamaModel: string;
  openaiBaseUrl: string;
  openaiModel: string;
  openaiApiKey: string;
  xaiModel: string;
  debugMode: boolean;
  autoMemoriesGlobal: boolean;
  autoCharactersGlobal: boolean;
};

export type PromptBlockKind =
  | "system"
  | "style"
  | "story"
  | "character"
  | "persona"
  | "world"
  | "lore"
  | "relationships"
  | "memory"
  | "storyState"
  | "examples"
  | "chat"
  | "user";

export type PromptBlock = {
  id: string;
  kind: PromptBlockKind;
  title: string;
  content: string;
  tokens: number;
  included: boolean;
  rank: number;
};

export type GenerationTrace = {
  at: number;
  blocks: PromptBlock[];
  totalTokens: number;
  memoryIds: Id[];
  loreIds: Id[];
  characterIds: Id[];
  presetNames: string[];
  storyState?: StoryState;
};

export type LogEntry = {
  at: number;
  level: "info" | "warn" | "error";
  message: string;
  data?: Record<string, unknown>;
};

export type EntityHit = {
  kind: "character" | "location" | "object" | "topic" | "other";
  name: string;
  id?: Id;
};

export type DetectedEntities = {
  characters: EntityHit[];
  locations: EntityHit[];
  others: EntityHit[];
  keywords: string[];
};

export type AnalyzerMemory = {
  type: MemoryType;
  subjects: string[];
  content: string;
  importance: number;
  confidence: number;
  relationshipImpact: number;
  observation: boolean;
};

export type AnalyzerCharacter = {
  name: string;
  facts: string[];
  confidence: number;
};

export type AnalyzerOutput = {
  memories: AnalyzerMemory[];
  characters: AnalyzerCharacter[];
  relationshipUpdates: {
    a: string;
    b: string;
    label?: string;
    state?: string;
    note?: string;
    confidence: number;
  }[];
  storyStateUpdates: Partial<Omit<StoryState, "updatedAt" | "presentCharacterIds">> & {
    present?: string[];
  };
};

export type TokenBudget = {
  system: number;
  character: number;
  persona: number;
  lore: number;
  memory: number;
  storyState: number;
  chat: number;
  user: number;
  total: number;
};

export const DEFAULT_BUDGET: TokenBudget = {
  system: 1500,
  character: 2500,
  persona: 1000,
  lore: 3000,
  memory: 3000,
  storyState: 1000,
  chat: 12000,
  user: 500,
  total: 24500,
};

export type ContextPack = {
  characters: Character[];
  persona?: Persona;
  world?: World;
  lore: LoreEntry[];
  memories: Memory[];
  relationships: Relationship[];
  storyState?: StoryState;
  chat: ChatMessage[];
  entities: DetectedEntities;
  budget: TokenBudget;
  /** Cast members who exist in the story but are not in the current scene. */
  absentCharacters: Character[];
};
