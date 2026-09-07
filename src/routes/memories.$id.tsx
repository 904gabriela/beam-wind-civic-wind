import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Pin, Trash2 } from "lucide-react";
import { Chip, PageHeader, TextInput } from "@/components/ui";
import { useHydrated, useNexus } from "@/lib/nexus/store";
import { memoryProvenance } from "@/lib/nexus/context-engine";
import { cn } from "@/lib/utils";
import type { MemoryType } from "@/lib/nexus/types";

export const Route = createFileRoute("/memories/$id")({ component: MemoriesPage });

const TYPES: Array<MemoryType | "all"> = [
  "all",
  "event",
  "relationship_event",
  "promise",
  "secret",
  "fact",
  "conflict",
  "goal",
];

function MemoriesPage() {
  const { id } = Route.useParams();
  const hydrated = useHydrated();
  const story = useNexus((s) => s.stories[id]);
  const memoriesMap = useNexus((s) => s.memories);
  const patch = useNexus((s) => s.patchMemory);
  const del = useNexus((s) => s.deleteMemory);
  const all = Object.values(memoriesMap).filter((m) => m.storyId === id && m.status !== "deleted");
  const [q, setQ] = useState("");
  const [type, setType] = useState<MemoryType | "all">("all");
  const [sort, setSort] = useState<"importance" | "recent">("importance");

  const list = useMemo(() => {
    let next = all;
    if (type !== "all") next = next.filter((m) => m.type === type);
    if (q.trim()) {
      const n = q.toLowerCase();
      next = next.filter((m) => m.content.toLowerCase().includes(n));
    }
    next = [...next].sort((a, b) =>
      sort === "importance"
        ? Number(b.pinned) - Number(a.pinned) || b.importance - a.importance
        : b.createdAt - a.createdAt,
    );
    return next;
  }, [all, q, type, sort]);

  if (!story) {
    if (!hydrated) return <main className="min-h-dvh bg-bg" />;
    return (
      <main className="px-6 py-20 text-center">
        <p className="font-display text-2xl">Story missing</p>
        <Link to="/" className="mt-3 inline-block text-sm text-muted">
          Back
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-12">
      <PageHeader
        title="Memory matrix"
        subtitle={story.name}
        action={
          <Link to="/play/$id" params={{ id }} className="text-sm text-muted">
            Back to chat
          </Link>
        }
      />
      <div className="px-4 lg:px-8">
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search memories" />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {TYPES.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>
              {t === "relationship_event" ? "relationship" : t}
            </Chip>
          ))}
        </div>
        <button
          type="button"
          className="mb-3 text-xs text-muted"
          onClick={() => setSort(sort === "importance" ? "recent" : "importance")}
        >
          Sort: {sort}
        </button>
        {list.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            No memories yet. Roleplay, and Nexus will keep what matters.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {list.map((m) => (
              <li key={m.id} className="rounded-xl border border-border bg-surface p-4">
                <textarea
                  defaultValue={m.content}
                  onBlur={(e) => {
                    if (e.target.value.trim() !== m.content) {
                      patch(m.id, {
                        content: e.target.value.trim(),
                        summary: e.target.value.trim(),
                        manuallyEdited: true,
                      });
                    }
                  }}
                  className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
                  rows={2}
                />
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-subtle">
                  <span>{m.type.replace("_", " ")}</span>
                  <span>{memoryProvenance(m)}</span>
                  <span>importance {Math.round(m.importance * 100)}%</span>
                  <span>confidence {Math.round(m.confidence * 100)}%</span>
                  {m.subjects.length ? <span>{m.subjects.join(", ")}</span> : null}
                  {m.status === "soft" ? <span>soft</span> : null}
                  {m.manuallyEdited ? <span>edited</span> : null}
                  <span className="ml-auto flex gap-1">
                    <button
                      type="button"
                      aria-label="Pin"
                      className={cn("flex size-9 items-center justify-center", m.pinned && "text-fg")}
                      onClick={() => patch(m.id, { pinned: !m.pinned, manuallyEdited: true })}
                    >
                      <Pin className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete"
                      className="flex size-9 items-center justify-center"
                      onClick={() => del(m.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
