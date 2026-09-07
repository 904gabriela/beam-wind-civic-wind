import type {
  Character,
  DetectedEntities,
  EntityHit,
  LoreEntry,
  World,
} from "./types.ts";

const STOP = new Set(
  [
    "The",
    "She",
    "He",
    "They",
    "You",
    "Your",
    "I",
    "A",
    "An",
    "It",
    "We",
    "Then",
    "And",
    "But",
    "When",
    "If",
    "As",
    "There",
    "This",
    "That",
    "Her",
    "His",
    "Him",
    "Not",
    "No",
    "Yes",
    "What",
    "Why",
    "How",
    "Who",
    "Where",
    "With",
    "From",
    "Into",
    "Over",
    "Under",
    "After",
    "Before",
    "Still",
    "Just",
    "Maybe",
    "Something",
    "Someone",
    "Nothing",
    "Okay",
    "Alright",
    "Well",
    "Please",
    "Sorry",
    "Hello",
    "Good",
    "Bad",
    "Very",
    "Really",
    "Already",
    "Always",
    "Never",
    "Once",
    "Again",
    "Back",
    "Down",
    "Up",
    "Out",
    "Off",
    "On",
    "In",
    "At",
    "To",
    "For",
    "Of",
    "Or",
    "So",
    "Too",
    "Now",
    "Here",
    "Look",
    "Let",
    "Can",
    "Could",
    "Would",
    "Should",
    "Will",
    "Did",
    "Does",
    "Don't",
    "Didn't",
    "It's",
    "I'm",
    "You're",
    "We're",
    "They're",
    "That's",
    "There's",
  ].map((s) => s.toLowerCase()),
);

function aliasesOf(c: Character): string[] {
  return [c.name, ...c.aliases].map((s) => s.trim()).filter(Boolean);
}

export function matchCharacter(text: string, characters: Character[]): Character[] {
  const lower = text.toLowerCase();
  return characters.filter((c) =>
    aliasesOf(c).some((alias) => {
      if (alias.length < 2) return false;
      const a = alias.toLowerCase();
      const re = new RegExp(`\\b${escapeReg(a)}\\b`, "i");
      return re.test(lower) || lower.includes(a);
    }),
  );
}

export function detectEntities(
  text: string,
  characters: Character[],
  lore: LoreEntry[] = [],
  world?: World,
): DetectedEntities {
  const hits = matchCharacter(text, characters);
  const charHits: EntityHit[] = hits.map((c) => ({
    kind: "character",
    name: c.name,
    id: c.id,
  }));

  const locations: EntityHit[] = [];
  for (const entry of lore) {
    const keys = [entry.title, ...entry.keywords, ...entry.aliases];
    if (
      entry.category.toLowerCase().includes("location") ||
      keys.some((k) => k && new RegExp(`\\b${escapeReg(k)}\\b`, "i").test(text))
    ) {
      if (keys.some((k) => k && new RegExp(`\\b${escapeReg(k)}\\b`, "i").test(text))) {
        locations.push({ kind: "location", name: entry.title, id: entry.id });
      }
    }
  }
  if (world && new RegExp(`\\b${escapeReg(world.name)}\\b`, "i").test(text)) {
    locations.push({ kind: "location", name: world.name, id: world.id });
  }

  const others: EntityHit[] = [];
  const nameRe = /\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/g;
  let m: RegExpExecArray | null;
  const known = new Set(
    [...charHits, ...locations].map((h) => h.name.toLowerCase()),
  );
  while ((m = nameRe.exec(text))) {
    const name = m[1];
    const first = name.split(/\s+/)[0].toLowerCase();
    if (STOP.has(first)) continue;
    if (known.has(name.toLowerCase())) continue;
    if (charHits.some((h) => h.name.toLowerCase() === name.toLowerCase())) continue;
    others.push({ kind: "other", name });
    known.add(name.toLowerCase());
  }

  const keywords = tokenize(text).filter((t) => t.length > 3).slice(0, 24);

  return { characters: charHits, locations, others, keywords };
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size === 0 && B.size === 0) return 1;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function normalizeLine(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function escapeReg(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
