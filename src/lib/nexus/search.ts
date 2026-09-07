import type { Character, ChatMessage, LoreEntry, Memory, Persona, Story, World } from "./types.ts";

export type SearchHit = {
  kind: "story" | "character" | "persona" | "lore" | "memory" | "world";
  id: string;
  title: string;
  snippet: string;
};

export function searchAll(opts: {
  query: string;
  stories: Story[];
  characters: Character[];
  personas: Persona[];
  worlds: World[];
  lore: LoreEntry[];
  memories: Memory[];
}): SearchHit[] {
  const q = opts.query.trim().toLowerCase();
  if (q.length < 1) return [];
  const hits: SearchHit[] = [];
  const add = (kind: SearchHit["kind"], id: string, title: string, text: string) => {
    if (!hay(title, text).includes(q)) return;
    hits.push({ kind, id, title, snippet: snippet(text || title, q) });
  };
  for (const s of opts.stories) add("story", s.id, s.name, s.description);
  for (const c of opts.characters) add("character", c.id, c.name, `${c.description} ${c.personality} ${c.tags.join(" ")}`);
  for (const p of opts.personas) add("persona", p.id, p.name, `${p.personality} ${p.background}`);
  for (const w of opts.worlds) add("world", w.id, w.name, w.description);
  for (const l of opts.lore) add("lore", l.id, l.title, l.content);
  for (const m of opts.memories.filter((m) => m.status !== "deleted")) {
    add("memory", m.id, m.type, m.content);
  }
  return hits.slice(0, 60);
}

export function messageSnippet(messages: ChatMessage[], q: string): ChatMessage[] {
  const n = q.trim().toLowerCase();
  if (!n) return [];
  return messages.filter((m) => m.content.toLowerCase().includes(n)).slice(0, 20);
}

function hay(...parts: string[]): string {
  return parts.join(" ").toLowerCase();
}

function snippet(text: string, q: string): string {
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text.slice(0, 140);
  const start = Math.max(0, i - 40);
  return (start > 0 ? "…" : "") + text.slice(start, start + 160);
}
