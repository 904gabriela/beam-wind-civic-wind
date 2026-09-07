import { useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp } from "lucide-react";
import { toast } from "sonner";
import { Button, Chip, PageHeader, Select, TextArea } from "@/components/ui";
import {
  importFile,
  importPayload,
  IMPORT_KIND_LABELS,
  sampleLorebookJson,
  samplePersonaJson,
  type ImportKind,
  type ImportedBundle,
} from "@/lib/nexus/import-export";
import { useNexus } from "@/lib/nexus/store";
import { cn } from "@/lib/utils";

const KINDS: ImportKind[] = ["character", "persona", "lorebook", "backup"];

type ImportSearch = {
  kind?: ImportKind;
  story?: string;
};

export const Route = createFileRoute("/import")({
  validateSearch: (search: Record<string, unknown>): ImportSearch => ({
    kind:
      typeof search.kind === "string" && KINDS.includes(search.kind as ImportKind)
        ? (search.kind as ImportKind)
        : undefined,
    story: typeof search.story === "string" ? search.story : undefined,
  }),
  component: ImportPage,
});

function ImportPage() {
  const { kind: forceKind, story: storyFromQuery } = Route.useSearch();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const stories = useNexus((s) => s.stories);
  const commitImport = useNexus((s) => s.commitImport);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [raw, setRaw] = useState("");
  const [storyId, setStoryId] = useState(storyFromQuery ?? "");
  const [pending, setPending] = useState<ImportedBundle[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const hint = useMemo(() => {
    if (forceKind === "persona") return "Paste persona JSON, or load the sample. It becomes who you are in the story.";
    if (forceKind === "lorebook")
      return "Paste a lorebook or SillyTavern world-info file. Keywords decide when facts appear.";
    if (forceKind === "character") return "Paste a character card, or drop a PNG card / portrait.";
    return "Paste JSON, load a sample, or drop a card. File pickers may not work in this preview — paste always does.";
  }, [forceKind]);

  async function handleFiles(files: FileList | File[] | null) {
    if (!files) return;
    const list = Array.from(files);
    if (!list.length) return;
    setParsing(true);
    setErrors([]);
    const next: ImportedBundle[] = [];
    const failures: string[] = [];
    for (const file of list) {
      try {
        const bundle = await importFile(file, { forceKind, filename: file.name });
        if (bundle.kind === "unknown" && bundle.warnings.length) {
          failures.push(`${file.name}: ${bundle.warnings[0]}`);
        } else {
          next.push(bundle);
        }
      } catch (err) {
        failures.push(`${file.name}: ${err instanceof Error ? err.message : "Could not read file."}`);
      }
    }
    setPending((cur) => [...cur, ...next]);
    setErrors(failures);
    setParsing(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  function queuePaste() {
    const bundle = importPayload(raw, { forceKind });
    if (bundle.kind === "unknown" && bundle.warnings.length && !bundle.characters.length) {
      setErrors(bundle.warnings);
      return;
    }
    setErrors([]);
    setPending((cur) => [...cur, bundle]);
    setRaw("");
  }

  function commit(bundle: ImportedBundle) {
    const result = commitImport(bundle, { storyId: storyId || undefined });
    const label = bundle.summary.join(", ") || bundle.title;
    toast(`Loaded ${label}`, {
      description: storyId ? `Attached to ${stories[storyId]?.name ?? "the story"}.` : undefined,
    });
    setPending((cur) => cur.filter((b) => b !== bundle));

    if (storyId) {
      navigate({ to: "/story/$id", params: { id: storyId } });
      return;
    }
    if (bundle.kind === "persona" && bundle.personas[0]) {
      navigate({ to: "/persona/$id", params: { id: bundle.personas[0].id } });
      return;
    }
    if (bundle.kind === "lorebook" && bundle.lorebooks[0]) {
      navigate({ to: "/lorebook/$id", params: { id: bundle.lorebooks[0].id } });
      return;
    }
    if (bundle.kind === "character" && bundle.characters[0]) {
      navigate({ to: "/character/$id", params: { id: bundle.characters[0].id } });
      return;
    }
    if (result.firstId && bundle.lorebooks[0]) {
      navigate({ to: "/lorebook/$id", params: { id: bundle.lorebooks[0].id } });
      return;
    }
    navigate({ to: "/library" });
  }

  function loadSample(rawJson: string) {
    const bundle = importPayload(rawJson, { forceKind });
    if (bundle.kind === "unknown") {
      setErrors(bundle.warnings);
      return;
    }
    commit(bundle);
  }

  const storyList = Object.values(stories).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <main className="pb-12">
      <PageHeader
        title="Import"
        subtitle={
          forceKind
            ? `Load a ${IMPORT_KIND_LABELS[forceKind].toLowerCase()}.`
            : "Load a persona, lorebook, or character card."
        }
      />

      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 lg:px-8">
        <div className="flex flex-wrap gap-2">
          <Chip
            active={!forceKind}
            onClick={() => navigate({ to: "/import", search: { story: storyId || undefined } })}
          >
            Any
          </Chip>
          {KINDS.filter((k) => k !== "backup").map((k) => (
            <Chip
              key={k}
              active={forceKind === k}
              onClick={() => navigate({ to: "/import", search: { kind: k, story: storyId || undefined } })}
            >
              {IMPORT_KIND_LABELS[k]}
            </Chip>
          ))}
        </div>

        <section>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted">Load a sample</p>
          <p className="mb-3 text-sm text-muted">
            These add a real persona or lorebook to your library so you can see them in chat.
          </p>
          <div className="flex flex-col gap-2">
            {forceKind !== "lorebook" && forceKind !== "character" ? (
              <Button onClick={() => loadSample(samplePersonaJson())}>Load sample persona — Ash Calder</Button>
            ) : null}
            {forceKind !== "persona" && forceKind !== "character" ? (
              <Button variant="ghost" onClick={() => loadSample(sampleLorebookJson())}>
                Load sample lorebook — Ashfell
              </Button>
            ) : null}
          </div>
        </section>

        <FieldPaste raw={raw} setRaw={setRaw} onPreview={queuePaste} hint={hint} />

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition-colors duration-150",
            dragging ? "border-fg bg-elevated" : "border-border bg-surface",
          )}
        >
          <FileUp className="size-5 text-muted" />
          <p className="mt-2 font-medium">{parsing ? "Reading…" : "Drop a file here"}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">JSON cards, PNG character cards, or a portrait image.</p>
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept=".json,.txt,.md,.png,.jpg,.jpeg,.webp,application/json,text/plain,image/png,image/jpeg"
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wide text-muted">Attach to a story (optional)</span>
          <Select value={storyId} onChange={(e) => setStoryId(e.target.value)}>
            <option value="">Library only — attach later from a story or chat</option>
            {storyList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </label>

        {errors.map((err) => (
          <p key={err} className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {err}
          </p>
        ))}

        {pending.length ? (
          <section>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted">Ready ({pending.length})</p>
            <ul className="flex flex-col gap-2">
              {pending.map((bundle, i) => (
                <li key={`${bundle.title}-${i}`} className="rounded-xl border border-border bg-surface p-4">
                  {bundle.image ? (
                    <img src={bundle.image} alt="" className="mb-3 h-28 w-20 rounded-lg object-cover object-top" />
                  ) : null}
                  <p className="text-xs uppercase tracking-wide text-subtle">
                    {IMPORT_KIND_LABELS[bundle.kind]} · {bundle.format}
                  </p>
                  <p className="mt-1 font-display text-xl">{bundle.title}</p>
                  <p className="mt-1 text-sm text-muted">{bundle.summary.join(" · ") || "Recognised."}</p>
                  {bundle.personas[0]?.personality ? (
                    <p className="mt-2 line-clamp-3 text-sm text-muted">{bundle.personas[0].personality}</p>
                  ) : null}
                  {bundle.lore.slice(0, 3).map((e) => (
                    <p key={e.id} className="mt-1 text-sm text-muted">
                      {e.title}: {e.keywords.join(", ") || "always on"}
                    </p>
                  ))}
                  {bundle.warnings.map((w) => (
                    <p key={w} className="mt-1 text-xs text-subtle">
                      {w}
                    </p>
                  ))}
                  <Button className="mt-3" onClick={() => commit(bundle)}>
                    Add {bundle.title}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function FieldPaste({
  raw,
  setRaw,
  onPreview,
  hint,
}: {
  raw: string;
  setRaw: (v: string) => void;
  onPreview: () => void;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wide text-muted">Paste JSON</span>
      <p className="text-sm text-muted">{hint}</p>
      <TextArea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder='{"name":"Ash Calder","personality":"Quiet, dry humor…"}'
        className="min-h-40"
      />
      <Button onClick={onPreview} disabled={!raw.trim()} variant="ghost">
        Preview paste
      </Button>
    </div>
  );
}
