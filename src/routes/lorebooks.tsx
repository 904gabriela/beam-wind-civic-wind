import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { createBlankLorebook, useHydrated, useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/lorebooks")({ component: LorebooksPage });

function LorebooksPage() {
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const booksMap = useNexus((s) => s.lorebooks);
  const loreMap = useNexus((s) => s.lore);
  const storiesMap = useNexus((s) => s.stories);
  const upsert = useNexus((s) => s.upsertLorebook);
  const books = Object.values(booksMap).sort((a, b) => b.updatedAt - a.updatedAt);
  const lore = Object.values(loreMap);
  const stories = Object.values(storiesMap);

  return (
    <main>
      <PageHeader
        title="Lorebooks"
        subtitle="World facts that surface when they become relevant."
        action={
          <div className="flex gap-2">
            <Link
              to="/import"
              search={{ kind: "lorebook" }}
              className="inline-flex h-11 items-center rounded-md border border-border px-3 text-sm"
            >
              Import
            </Link>
            <Button
              onClick={() => {
                const book = createBlankLorebook("New lorebook");
                upsert(book);
                navigate({ to: "/lorebook/$id", params: { id: book.id } });
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
        <Link to="/personas" className="inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted">
          Personas
        </Link>
        <span className="inline-flex h-9 items-center rounded-full bg-fg px-3.5 text-sm font-medium text-bg">
          Lorebooks
        </span>
      </div>
      {!hydrated && books.length === 0 ? (
        <div className="px-4">
          <div className="h-24 rounded-xl bg-surface" />
        </div>
      ) : books.length === 0 ? (
        <EmptyState
          title="No lorebooks yet"
          message="Import a SillyTavern world-info file, or write entries with keywords. They stay out of chat until the words appear."
          action={
            <Link
              to="/import"
              search={{ kind: "lorebook" }}
              className="inline-flex h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg"
            >
              Import a lorebook
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-2 px-4 pb-10 pr-28 lg:px-8 lg:pr-32">
          {books.map((book) => {
            const count = lore.filter((e) => e.lorebookId === book.id).length;
            const used = stories.filter((s) => s.lorebookIds?.includes(book.id)).length;
            return (
              <li key={book.id}>
                <Link
                  to="/lorebook/$id"
                  params={{ id: book.id }}
                  className="block rounded-xl border border-border bg-surface p-4"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-display text-xl">{book.name}</span>
                    {book.global ? (
                      <span className="rounded-full bg-elevated px-2 py-0.5 text-xs text-muted">Global</span>
                    ) : null}
                    {!book.enabled ? (
                      <span className="rounded-full bg-elevated px-2 py-0.5 text-xs text-danger">Off</span>
                    ) : null}
                  </span>
                  {book.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{book.description}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-subtle">
                    {count} {count === 1 ? "entry" : "entries"}
                    {used ? ` · ${used} ${used === 1 ? "story" : "stories"}` : " · not attached yet"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
