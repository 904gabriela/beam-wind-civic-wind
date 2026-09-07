import { useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PortraitCard } from "@/components/portrait-card";
import { CHARACTERS } from "@/lib/characters";
import { useHydrated, useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/")({ component: Discover });

const FEATURED = new Set(CHARACTERS.filter((c) => c.featured).map((c) => c.id));
const CATALOG_ORDER = CHARACTERS.map((c) => c.id);

function Discover() {
  const hydrated = useHydrated();
  const charactersMap = useNexus((s) => s.characters);
  const worldsMap = useNexus((s) => s.worlds);
  const storiesMap = useNexus((s) => s.stories);

  const cards = useMemo(() => {
    const people = Object.values(charactersMap)
      .filter((c) => c.origin !== "discovered")
      .map((c) => ({
        id: c.id,
        name: c.name,
        image: c.image,
        tagline: c.creatorNotes || CHARACTERS.find((x) => x.id === c.id)?.tagline || c.description,
        featured: FEATURED.has(c.id),
        kind: "character" as const,
      }));
    const places = Object.values(worldsMap).map((w) => ({
      id: w.id,
      name: w.name,
      image: w.image,
      tagline: CHARACTERS.find((c) => c.id === w.id)?.tagline || w.description.split("\n")[0],
      featured: FEATURED.has(w.id),
      kind: "world" as const,
    }));
    return [...people, ...places].sort((a, b) => {
      const ai = CATALOG_ORDER.indexOf(a.id);
      const bi = CATALOG_ORDER.indexOf(b.id);
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [charactersMap, worldsMap]);

  const recent = useMemo(
    () => Object.values(storiesMap).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6),
    [storiesMap],
  );

  return (
    <main className="pb-8">
      <header className="flex items-end justify-between px-4 pt-6 pb-3 pr-36 lg:px-8 lg:pr-40">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted">For you</p>
          <h1 className="font-display text-3xl tracking-tight">Discover</h1>
        </div>
        <Link to="/search" aria-label="Search" className="flex size-11 items-center justify-center text-muted">
          <Search className="size-5" />
        </Link>
      </header>

      {recent.length ? (
        <section className="mb-5">
          <div className="mb-2 flex items-center justify-between px-4 lg:px-8">
            <p className="text-xs font-medium tracking-wide text-muted">Continue</p>
            <Link to="/chats" className="text-xs text-muted">
              All chats
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-1 lg:px-8">
            {recent.map((story) => (
              <Link
                key={story.id}
                to="/play/$id"
                params={{ id: story.id }}
                className="relative h-36 w-28 shrink-0 overflow-hidden rounded-xl bg-elevated"
              >
                {story.image ? (
                  <img src={story.image} alt="" className="size-full object-cover object-top" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-2 font-display text-sm leading-tight">{story.name}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {!hydrated && cards.length === 0 ? (
        <div className="grid grid-cols-2 gap-2 px-3 lg:px-8">
          <div className="banner col-span-2 rounded-xl bg-surface" />
          <div className="portrait rounded-xl bg-surface" />
          <div className="portrait rounded-xl bg-surface" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 px-3 pb-4 lg:grid-cols-4 lg:px-8">
          {cards.map((card) => (
            <PortraitCard
              key={card.id}
              name={card.name}
              image={card.image}
              tagline={card.tagline}
              featured={card.featured}
              to={card.kind === "world" ? "/world/$id" : "/character/$id"}
              params={{ id: card.id }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
