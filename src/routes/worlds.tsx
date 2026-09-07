import { Link, createFileRoute } from "@tanstack/react-router";
import { PortraitCard } from "@/components/portrait-card";
import { CHARACTERS } from "@/lib/characters";
import { useHydrated, useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/worlds")({ component: Worlds });

function Worlds() {
  const hydrated = useHydrated();
  const worldsMap = useNexus((s) => s.worlds);
  const worlds = Object.values(worldsMap).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="pb-8">
      <header className="flex items-end justify-between gap-4 px-4 pt-6 pb-3 pr-36 lg:px-8 lg:pr-40">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Worlds</h1>
          <p className="mt-1 text-sm text-muted">Places you can walk into.</p>
        </div>
        <Link
          to="/create"
          className="inline-flex h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg"
        >
          New
        </Link>
      </header>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:px-8">
        <Link to="/library" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Characters
        </Link>
        <span className="inline-flex h-9 items-center rounded-full bg-fg px-3.5 text-sm font-medium text-bg">
          Worlds
        </span>
        <Link to="/personas" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Personas
        </Link>
        <Link to="/lorebooks" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Lorebooks
        </Link>
      </div>
      {!hydrated && worlds.length === 0 ? (
        <div className="grid grid-cols-2 gap-2 px-3">
          <div className="banner col-span-2 rounded-xl bg-surface" />
        </div>
      ) : worlds.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-muted">Create a world, or open one from Discover.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 px-3 pb-4 lg:grid-cols-4 lg:px-8">
          {worlds.map((w) => {
            const catalog = CHARACTERS.find((c) => c.id === w.id);
            return (
              <PortraitCard
                key={w.id}
                name={w.name}
                image={w.image}
                tagline={catalog?.tagline || w.description.split("\n")[0]}
                featured={Boolean(catalog?.featured)}
                to="/world/$id"
                params={{ id: w.id }}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
