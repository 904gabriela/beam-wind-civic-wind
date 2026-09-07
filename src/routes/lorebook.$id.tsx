import { useMemo, useRef, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button, Chip, Field, TextArea, TextInput, Toggle } from "@/components/ui";
import {
  downloadJson,
  exportLorebook,
  importFile,
} from "@/lib/nexus/import-export";
import {
  createBlankLoreEntry,
  useHydrated,
  useNexus,
} from "@/lib/nexus/store";
import { nid } from "@/lib/nexus/ids";

export const Route = createFileRoute("/lorebook/$id")({ component: LorebookEditor });

function LorebookEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const fileInput = useRef<HTMLInputElement>(null);
  const book = useNexus((s) => s.lorebooks[id]);
  const loreMap = useNexus((s) => s.lore);
  const storiesMap = useNexus((s) => s.stories);
  const upsertBook = useNexus((s) => s.upsertLorebook);
  const deleteBook = useNexus((s) => s.deleteLorebook);
  const upsertLore = useNexus((s) => s.upsertLore);
  const deleteLore = useNexus((s) => s.deleteLore);
  const upsertStory = useNexus((s) => s.upsertStory);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [tab, setTab] = useState<"entries" | "settings">("entries");

  const entries = useMemo(
    () => Object.values(loreMap).filter((e) => e.lorebookId === id),
    [loreMap, id],
  );
  const stories = useMemo(() => Object.values(storiesMap), [storiesMap]);

  if (!book) {
    if (!hydrated) return <main className="min-h-dvh bg-bg" />;
    return (
      <main className="px-6 py-20 text-center">
        <p className="font-display text-2xl">Lorebook missing</p>
        <Link to="/lorebooks" className="mt-3 inline-block text-sm text-muted">
          Lorebooks
        </Link>
      </main>
    );
  }

  const draft = editing === "new" ? null : editing ? loreMap[editing] : null;

  async function importIntoBook(file: File | undefined) {
    if (!file) return;
    const bundle = await importFile(file, { forceKind: "lorebook", filename: file.name });
    const incoming = bundle.lore;
    if (!incoming.length) {
      toast("No entries found in that file");
      return;
    }
    for (const entry of incoming) {
      upsertLore({
        ...entry,
        id: nid(),
        lorebookId: id,
      });
    }
    toast(`Added ${incoming.length} ${incoming.length === 1 ? "entry" : "entries"}`);
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <main className="pb-12">
      <Link
        to="/lorebooks"
        className="inline-flex items-center gap-1 px-4 pt-5 text-sm text-muted lg:px-8"
      >
        <ChevronLeft className="size-4" />
        Lorebooks
      </Link>
      <header className="flex items-end justify-between gap-4 px-4 pt-3 pb-4 pr-28 lg:px-8">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{book.name || "Untitled lorebook"}</h1>
          <p className="mt-1 text-sm text-muted">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
            {book.global ? " · applies to every story" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            const entry = createBlankLoreEntry(id);
            upsertLore(entry);
            setEditing(entry.id);
            setTab("entries");
          }}
        >
          Entry
        </Button>
      </header>

      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 lg:px-8">
        <div className="flex gap-2">
          <Chip active={tab === "entries"} onClick={() => setTab("entries")}>
            Entries
          </Chip>
          <Chip active={tab === "settings"} onClick={() => setTab("settings")}>
            Settings
          </Chip>
        </div>

        {tab === "settings" ? (
          <>
            <Field label="Name">
              <TextInput value={book.name} onChange={(e) => upsertBook({ ...book, name: e.target.value })} />
            </Field>
            <Field label="Description">
              <TextArea
                value={book.description}
                onChange={(e) => upsertBook({ ...book, description: e.target.value })}
              />
            </Field>
            <Toggle
              checked={book.enabled}
              onChange={(v) => upsertBook({ ...book, enabled: v })}
              label="Enabled"
            />
            <Toggle
              checked={book.global}
              onChange={(v) => upsertBook({ ...book, global: v })}
              label="Apply to every story"
            />
            <section>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted">Attached to stories</p>
              <div className="flex flex-col gap-1">
                {stories.map((st) => {
                  const on = st.lorebookIds?.includes(id);
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        const next = on
                          ? (st.lorebookIds ?? []).filter((bid) => bid !== id)
                          : [...(st.lorebookIds ?? []), id];
                        upsertStory({ ...st, lorebookIds: next });
                      }}
                      className="flex h-11 items-center justify-between rounded-lg border border-border px-3 text-sm"
                    >
                      <span>{st.name}</span>
                      <span className="text-xs text-muted">{on ? "Attached" : "Off"}</span>
                    </button>
                  );
                })}
              </div>
            </section>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  downloadJson(`${book.name || "lorebook"}.json`, exportLorebook(book, entries));
                  toast("Lorebook exported");
                }}
              >
                Export JSON
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteBook(id);
                  navigate({ to: "/lorebooks" });
                }}
              >
                Delete lorebook
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  const entry = createBlankLoreEntry(id);
                  upsertLore(entry);
                  setEditing(entry.id);
                }}
              >
                Add entry
              </Button>
              <Button variant="ghost" onClick={() => fileInput.current?.click()}>
                Import entries
              </Button>
              <input
                ref={fileInput}
                type="file"
                accept=".json,application/json,.txt"
                className="sr-only"
                onChange={(e) => void importIntoBook(e.target.files?.[0])}
              />
            </div>
            {entries.length === 0 ? (
              <p className="text-sm text-muted">
                Add an entry with a few keywords. When those words appear in the conversation, Nexus
                injects the content. Constant entries always load.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => setEditing(entry.id)}
                      className="w-full rounded-xl border border-border bg-surface p-4 text-left"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{entry.title || "Untitled"}</span>
                        {entry.always ? (
                          <span className="text-xs text-subtle">Always</span>
                        ) : null}
                        {!entry.enabled ? (
                          <span className="text-xs text-danger">Off</span>
                        ) : null}
                      </span>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{entry.content || "Empty"}</p>
                      <p className="mt-1 text-xs text-subtle">
                        {entry.keywords.length ? entry.keywords.join(", ") : "No keywords"}
                      </p>
                    </button>
                    {draft?.id === entry.id ? (
                      <div className="mt-2 rounded-xl border border-border bg-elevated p-3">
                        <Field label="Title">
                          <TextInput
                            value={entry.title}
                            onChange={(e) => upsertLore({ ...entry, title: e.target.value })}
                          />
                        </Field>
                        <div className="mt-3">
                          <Field label="Keywords" hint="Comma separated. Matched against recent chat.">
                            <TextInput
                              value={entry.keywords.join(", ")}
                              onChange={(e) =>
                                upsertLore({
                                  ...entry,
                                  keywords: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                                })
                              }
                            />
                          </Field>
                        </div>
                        <div className="mt-3">
                          <Field label="Content">
                            <TextArea
                              value={entry.content}
                              onChange={(e) => upsertLore({ ...entry, content: e.target.value })}
                            />
                          </Field>
                        </div>
                        <Toggle
                          checked={entry.always}
                          onChange={(v) => upsertLore({ ...entry, always: v })}
                          label="Always include (constant)"
                        />
                        <Toggle
                          checked={Boolean(entry.preventRecursion)}
                          onChange={(v) => upsertLore({ ...entry, preventRecursion: v })}
                          label="Don't pull this in from other entries"
                        />
                        <Toggle
                          checked={entry.enabled}
                          onChange={(v) => upsertLore({ ...entry, enabled: v })}
                          label="Enabled"
                        />
                        <div className="mt-2 flex gap-2">
                          <Button variant="ghost" onClick={() => setEditing(null)}>
                            Done
                          </Button>
                          <button
                            type="button"
                            className="text-sm text-danger"
                            onClick={() => {
                              deleteLore(entry.id);
                              setEditing(null);
                            }}
                          >
                            Delete entry
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
}
