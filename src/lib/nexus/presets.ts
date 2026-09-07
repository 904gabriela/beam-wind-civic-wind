import type { GenerationPreset } from "./types.ts";

export const BUILTIN_PRESETS: GenerationPreset[] = [
  {
    id: "preset-balanced",
    name: "Balanced",
    builtin: true,
    temperature: 0.85,
    topP: 0.95,
    maxTokens: 900,
    instructions:
      "Write in a natural literary register. Balance dialogue, action, and interiority. Keep continuity. Do not rush or stall the scene without cause.",
  },
  {
    id: "preset-detailed",
    name: "Detailed",
    builtin: true,
    temperature: 0.88,
    topP: 0.95,
    maxTokens: 1400,
    instructions:
      "Use descriptive prose. Include environmental and sensory detail when relevant. Use body language. Maintain continuity. Avoid repeating the same descriptions. Do not inflate every response with filler.",
  },
  {
    id: "preset-slow-burn",
    name: "Slow Burn",
    builtin: true,
    temperature: 0.85,
    topP: 0.95,
    maxTokens: 1200,
    instructions:
      "Develop relationships gradually. Do not force romantic progression. Allow attraction and emotional intimacy to emerge naturally. Preserve established personalities. Use subtle body language and dialogue. Allow uncertainty and tension. Do not resolve emotional conflicts immediately.",
  },
  {
    id: "preset-cinematic",
    name: "Cinematic",
    builtin: true,
    temperature: 0.9,
    topP: 0.96,
    maxTokens: 1200,
    instructions:
      "Write as if directing a scene: blocking, light, sound, and cutting. Open on an image. Let silence and glances carry meaning. Keep paragraphs visual and paced.",
  },
  {
    id: "preset-romantic",
    name: "Romantic",
    builtin: true,
    temperature: 0.9,
    topP: 0.96,
    maxTokens: 1100,
    instructions:
      "Lean into longing, tenderness, and emotional risk. Romance may grow if the characters and story support it. Never overwrite a character into sudden devotion. Keep desire specific, not generic.",
  },
  {
    id: "preset-dramatic",
    name: "Dramatic",
    builtin: true,
    temperature: 0.92,
    topP: 0.95,
    maxTokens: 1200,
    instructions:
      "Heighten stakes and emotional contrast. Let conflict land. Do not melodramatize every beat. Keep character voices sharp under pressure.",
  },
  {
    id: "preset-action",
    name: "Action",
    builtin: true,
    temperature: 0.86,
    topP: 0.92,
    maxTokens: 1000,
    instructions:
      "Prioritize motion, tactics, and consequence. Short beats in danger. Clear geography. Do not skip the cost of violence or effort.",
  },
  {
    id: "preset-comedy",
    name: "Comedy",
    builtin: true,
    temperature: 0.95,
    topP: 0.97,
    maxTokens: 900,
    instructions:
      "Find humor in character and situation, not in breaking the world. Witty, not sitcom-canned. Timing over punchline spam. Stay in character.",
  },
  {
    id: "preset-dark",
    name: "Dark",
    builtin: true,
    temperature: 0.84,
    topP: 0.94,
    maxTokens: 1200,
    instructions:
      "Lean into moral ambiguity, unease, and consequence. Do not glorify cruelty. Keep beauty and rot in the same frame. No cheap shock.",
  },
  {
    id: "preset-horror",
    name: "Horror",
    builtin: true,
    temperature: 0.82,
    topP: 0.93,
    maxTokens: 1100,
    instructions:
      "Dread over gore. Use implication, wrong details, and delayed reveals. The threat should feel specific. Do not jump-scare in text.",
  },
  {
    id: "preset-intimate",
    name: "Intimate",
    builtin: true,
    temperature: 0.88,
    topP: 0.96,
    maxTokens: 1100,
    instructions:
      "Close physical and emotional distance: breath, fabric, attention. Keep it literary. Emotional honesty over spectacle. Do not skip consent or character will.",
  },
  {
    id: "preset-fast",
    name: "Fast-Paced",
    builtin: true,
    temperature: 0.87,
    topP: 0.92,
    maxTokens: 700,
    instructions:
      "Move the scene. Short paragraphs. New information every beat. Cut throat-clearing and recap. End on a forward hook.",
  },
];

export type ComposedPreset = {
  name: string;
  ids: string[];
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

export function composePresets(presets: GenerationPreset[]): ComposedPreset {
  if (presets.length === 0) {
    const b = BUILTIN_PRESETS[0];
    return {
      name: b.name,
      ids: [b.id],
      instructions: b.instructions,
      temperature: b.temperature,
      topP: b.topP,
      maxTokens: b.maxTokens,
    };
  }
  const last = presets[presets.length - 1];
  const temperature =
    presets.reduce((sum, p) => sum + p.temperature, 0) / presets.length;
  return {
    name: presets.map((p) => p.name).join(" + "),
    ids: presets.map((p) => p.id),
    instructions: presets.map((p) => `## ${p.name}\n${p.instructions}`).join("\n\n"),
    temperature: Math.round(temperature * 100) / 100,
    topP: last.topP,
    topK: last.topK,
    minP: last.minP,
    repeatPenalty: last.repeatPenalty,
    frequencyPenalty: last.frequencyPenalty,
    presencePenalty: last.presencePenalty,
    maxTokens: Math.max(...presets.map((p) => p.maxTokens)),
  };
}

export function defaultPresetMap(): Record<string, GenerationPreset> {
  return Object.fromEntries(BUILTIN_PRESETS.map((p) => [p.id, p]));
}
