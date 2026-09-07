import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { createBlankPersona, useHydrated, useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/personas")({ component: PersonasPage });

function PersonasPage() {
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const personasMap = useNexus((s) => s.personas);
  const upsertPersona = useNexus((s) => s.upsertPersona);
  const personas = Object.values(personasMap).sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <main>
      <PageHeader
        title="Personas"
        subtitle="Who you are in the story."
        action={
          <div className="flex gap-2">
            <Link
              to="/import"
              search={{ kind: "persona" }}
              className="inline-flex h-11 items-center rounded-md border border-border px-3 text-sm"
            >
              Import
            </Link>
            <Button
              onClick={() => {
                const p = createBlankPersona("New persona");
                upsertPersona(p);
                navigate({ to: "/persona/$id", params: { id: p.id } });
              }}
            >
              New
            </Button>
          </div>
        }
      />
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:px-8">
        <Link to="/library" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Characters
        </Link>
        <Link to="/worlds" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Worlds
        </Link>
        <span className="inline-flex h-9 items-center rounded-full bg-fg px-3.5 text-sm font-medium text-bg">
          Personas
        </span>
        <Link to="/lorebooks" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Lorebooks
        </Link>
      </div>
      {!hydrated && personas.length === 0 ? (
        <div className="px-4">
          <div className="h-24 rounded-xl bg-surface" />
        </div>
      ) : personas.length === 0 ? (
        <EmptyState
          title="No personas yet"
          message="A persona is the character you play. Import a JSON file or write one here, then attach it from a story or chat."
          action={
            <Link
              to="/import"
              search={{ kind: "persona" }}
              className="inline-flex h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg"
            >
              Import a persona
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-2 px-4 pb-10 pr-28 lg:px-8 lg:pr-32">
          {personas.map((p) => (
            <li key={p.id}>
              <Link
                to="/persona/$id"
                params={{ id: p.id }}
                className="block rounded-xl border border-border bg-surface p-4"
              >
                <span className="flex items-center gap-2">
                  <span className="font-display text-xl">{p.name}</span>
                  {p.isDefault ? (
                    <span className="rounded-full bg-elevated px-2 py-0.5 text-xs text-muted">Default</span>
                  ) : null}
                </span>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {p.personality || p.preferences || "No notes yet."}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
