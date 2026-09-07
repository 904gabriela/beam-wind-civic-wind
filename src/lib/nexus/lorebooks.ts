import { rankLore } from "./context-engine.ts";
import type { DetectedEntities, Lorebook, LoreEntry, Story } from "./types.ts";

export function attachedLorebooks(story: Story, books: Lorebook[]): Lorebook[] {
  const attached = new Set(story.lorebookIds ?? []);
  return books.filter((book) => book.enabled && (book.global || attached.has(book.id)));
}

export function loreForStory(story: Story, lore: LoreEntry[], books: Lorebook[]): LoreEntry[] {
  if (story.loreActivation === "off") return [];
  const bookIds = new Set(attachedLorebooks(story, books).map((b) => b.id));
  return lore.filter((entry) => {
    if (!entry.enabled) return false;
    if (entry.lorebookId && bookIds.has(entry.lorebookId)) return true;
    if (story.loreIds.includes(entry.id)) return true;
    if (entry.storyId === story.id) return true;
    if (story.worldId && entry.worldId === story.worldId) return true;
    return false;
  });
}

export function triggerLore(
  entries: LoreEntry[],
  userText: string,
  entities: DetectedEntities,
  activation: Story["loreActivation"],
): LoreEntry[] {
  if (activation === "off") return [];
  if (activation === "all") return entries.filter((e) => e.enabled);
  const always = entries.filter((e) => e.enabled && e.always);
  const ranked = rankLore(
    entries.filter((e) => e.enabled && !e.always),
    entities,
    userText,
  );
  const seen = new Set<string>();
  const out: LoreEntry[] = [];
  for (const entry of [...always, ...ranked]) {
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    out.push(entry);
  }
  return out.slice(0, 16);
}
