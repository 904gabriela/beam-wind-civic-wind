import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader, TextInput } from "@/components/ui";
import { searchAll } from "@/lib/nexus/search";
import { useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/search")({ component: SearchPage });

function SearchPage() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const storiesMap = useNexus((s) => s.stories);
  const charactersMap = useNexus((s) => s.characters);
  const personasMap = useNexus((s) => s.personas);
  const worldsMap = useNexus((s) => s.worlds);
  const loreMap = useNexus((s) => s.lore);
  const memoriesMap = useNexus((s) => s.memories);
  const stories = Object.values(storiesMap);
  const characters = Object.values(charactersMap);
  const personas = Object.values(personasMap);
  const worlds = Object.values(worldsMap);
  const lore = Object.values(loreMap);
  const memories = Object.values(memoriesMap);
  const hits = useMemo(
    () => searchAll({ query: q, stories, characters, personas, worlds, lore, memories }),
    [q, stories, characters, personas, worlds, lore, memories],
  );

  function open(kind: string, id: string) {
    if (kind === "story") navigate({ to: "/story/$id", params: { id } });
    else if (kind === "character") navigate({ to: "/character/$id", params: { id } });
    else if (kind === "persona") navigate({ to: "/persona/$id", params: { id } });
    else if (kind === "lore") {
      const bookId = useNexus.getState().lore[id]?.lorebookId;
      if (bookId) navigate({ to: "/lorebook/$id", params: { id: bookId } });
      else navigate({ to: "/lorebooks" });
    }
    else if (kind === "memory") {
      const storyId = useNexus.getState().memories[id]?.storyId;
      if (storyId) navigate({ to: "/memories/$id", params: { id: storyId } });
    } else if (kind === "world") navigate({ to: "/world/$id", params: { id } });
    else navigate({ to: "/library" });
  }

  return (
    <main>
      <PageHeader title="Search" subtitle="Characters, worlds, chats, personas, lore." />
      <div className="px-4 lg:px-8">
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Nexus" autoFocus />
        <ul className="mt-4 flex flex-col gap-2 pb-10">
          {hits.map((h) => (
            <li key={`${h.kind}-${h.id}`}>
              <button
                type="button"
                onClick={() => open(h.kind, h.id)}
                className="block w-full rounded-xl border border-border bg-surface p-4 text-left"
              >
                <p className="text-xs uppercase tracking-wide text-subtle">{h.kind}</p>
                <p className="mt-1 font-medium">{h.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{h.snippet}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}