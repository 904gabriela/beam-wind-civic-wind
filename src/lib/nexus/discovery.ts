import { detectEntities } from "./entities.ts";
import { nid, now } from "./ids.ts";
import type { Character, LoreEntry, ObservedFact, World } from "./types.ts";

export function discoverCharacters(opts: {
  text: string;
  known: Character[];
  lore?: LoreEntry[];
  world?: World;
  sourceMessageId?: string;
}): Character[] {
  const entities = detectEntities(opts.text, opts.known, opts.lore ?? [], opts.world);
  const created: Character[] = [];
  for (const hit of entities.others) {
    const name = hit.name.trim();
    if (name.length < 3) continue;
    if (looksGeneric(name)) continue;
    const already =
      opts.known.some((c) => namesMatch(c, name)) ||
      created.some((c) => namesMatch(c, name));
    if (already) continue;
    const fact: ObservedFact = {
      id: nid(),
      content: extractFact(opts.text, name),
      sourceMessageId: opts.sourceMessageId,
      confidence: 0.86,
      createdAt: now(),
    };
    const t = now();
    created.push({
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
      creatorNotes: "Automatically discovered from the story. Only observed facts are stored.",
      tags: ["discovered"],
      origin: "discovered",
      observedFacts: [fact],
      confidence: fact.confidence,
      createdAt: t,
      updatedAt: t,
    });
  }
  return created;
}

export function enrichCharacter(character: Character, factText: string, sourceMessageId?: string): Character {
  const content = factText.trim();
  if (!content) return character;
  const dup = character.observedFacts.some(
    (f) => f.content.toLowerCase() === content.toLowerCase(),
  );
  if (dup) return character;
  const fact: ObservedFact = {
    id: nid(),
    content,
    sourceMessageId,
    confidence: 0.8,
    createdAt: now(),
  };
  const facts = [...character.observedFacts, fact].slice(-24);
  const confidence = Math.min(
    0.99,
    facts.reduce((s, f) => s + f.confidence, 0) / facts.length,
  );
  return {
    ...character,
    observedFacts: facts,
    confidence,
    updatedAt: now(),
  };
}

function namesMatch(c: Character, name: string): boolean {
  const n = name.toLowerCase();
  return c.name.toLowerCase() === n || c.aliases.some((a) => a.toLowerCase() === n);
}

function extractFact(text: string, name: string): string {
  const parts = text.split(/(?<=[.!?])\s+/);
  const hit = parts.find((p) => p.toLowerCase().includes(name.toLowerCase()));
  return (hit ?? `${name} appeared in the current storyline.`).trim().slice(0, 240);
}

function looksGeneric(name: string): boolean {
  if (/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|Chapter|Scene)$/i.test(name)) {
    return true;
  }
  const common = new Set(
    "play sit look come wait please maybe something someone everything nothing hello thanks fine sure right left back down open close stay leave take give keep tell ask know think feel want need make made said says went came let get got put run walk stand stand sat speak talk whisper smile laugh freeze nod glance turn".split(
      " ",
    ),
  );
  return common.has(name.toLowerCase());
}
