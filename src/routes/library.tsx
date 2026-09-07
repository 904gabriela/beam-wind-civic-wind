import { Link, createFileRoute } from "@tanstack/react-router";
import { PortraitCard } from "@/components/portrait-card";
import { CHARACTERS } from "@/lib/characters";
import { useHydrated, useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/library")({ component: Library });

function Library() {
  const hydrated = useHydrated();
  const charactersMap = useNexus((s) => s.characters);
  const characters = Object.values(charactersMap).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="pb-8">
      <header className="flex items-end justify-between gap-4 px-4 pt-6 pb-3 pr-36 lg:px-8 lg:pr-40">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Library</h1>
          <p className="mt-1 text-sm text-muted">Your cast.</p>
        </div>
        <Link
          to="/import"
          className="inline-flex h-11 items-center rounded-md border border-border px-3 text-sm"
        >
          Import
        </Link>
      </header>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:px-8">
        <span className="inline-flex h-9 items-center rounded-full bg-fg px-3.5 text-sm font-medium text-bg">
          Characters
        </span>
        <Link to="/worlds" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Worlds
        </Link>
        <Link to="/personas" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Personas
        </Link>
        <Link to="/lorebooks" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Lorebooks
        </Link>
      </div>
      {!hydrated && characters.length === 0 ? (
        <div className="grid grid-cols-2 gap-2 px-3">
          <div className="portrait rounded-xl bg-surface" />
          <div className="portrait rounded-xl bg-surface" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 px-3 pb-4 lg:grid-cols-4 lg:px-8">
          {characters.map((c) => (
            <PortraitCard
              key={c.id}
              name={c.name}
              image={c.image}
              tagline={
                c.origin === "discovered"
                  ? "Discovered"
                  : c.creatorNotes || CHARACTERS.find((x) => x.id === c.id)?.tagline || c.tags[0]
              }
              to="/character/$id"
              params={{ id: c.id }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
