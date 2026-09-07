import { useEffect, useMemo, useRef, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Pencil,
  RefreshCw,
  Send,
  Settings2,
  Square,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { RichText, stripChoices } from "@/components/rich-text";
import { StoryContextChips, StoryContextPanel } from "@/components/story-context";
import { Chip, Toggle } from "@/components/ui";
import { editUserMessage, regenerate, sendTurn } from "@/lib/nexus/chat-service";
import { siblingIndex, switchToSibling, visibleTranscript } from "@/lib/nexus/chat-tree";
import { composePresets } from "@/lib/nexus/presets";
import { useHydrated, useNexus } from "@/lib/nexus/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/play/$id")({ component: PlayPage });

function PlayPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const story = useNexus((s) => s.stories[id]);
  const chat = useNexus((s) => (story ? s.chats[story.chatId] : undefined));
  const messagesMap = useNexus((s) => s.messages);
  const characters = useNexus((s) => s.characters);
  const presets = useNexus((s) => s.presets);
  const lastTrace = useNexus((s) => s.lastTrace);
  const memoriesMap = useNexus((s) => s.memories);
  const upsertStory = useNexus((s) => s.upsertStory);
  const setChat = useNexus((s) => s.setChat);
  const memories = Object.values(memoriesMap).filter((m) => m.storyId === id && m.status !== "deleted");

  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<"none" | "quick" | "debug" | "map" | "context">("none");
  const [contextTab, setContextTab] = useState<"you" | "scene" | "lore" | "cast">("you");
  const [editingId, setEditingId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const memCount = useRef(memories.length);

  const transcript = useMemo(
    () => visibleTranscript(chat, messagesMap),
    [chat, messagesMap],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript.length, pending, transcript.at(-1)?.content]);

  useEffect(() => {
    if (memories.length > memCount.current) {
      const latest = [...memories].sort((a, b) => b.createdAt - a.createdAt)[0];
      if (latest && latest.importance >= 0.75 && latest.status === "committed") {
        toast("Memory updated", { description: latest.content });
      }
    }
    memCount.current = memories.length;
  }, [memories]);

  if (!story) {
    if (!hydrated) {
      return (
        <main className="flex min-h-dvh items-center justify-center bg-bg">
          <p className="text-sm text-muted">Opening the scene…</p>
        </main>
      );
    }
    return (
      <main className="flex min-h-dvh items-center justify-center px-6 text-center">
        <div>
          <p className="font-display text-2xl">This story closed</p>
          <Link to="/" className="mt-3 inline-block text-sm text-muted">
            Back to Nexus
          </Link>
        </div>
      </main>
    );
  }

  const cast = story.characterIds.map((cid) => characters[cid]).filter(Boolean);
  const composed = composePresets(story.presetIds.map((pid) => presets[pid]).filter(Boolean));
  const hero = cast[0];
  const lastAssistant = [...transcript].reverse().find((m) => m.role === "assistant");
  const lastChoices =
    !pending && lastAssistant ? stripChoices(lastAssistant.content).choices : [];

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    setDraft("");
    setError(null);
    setPending(true);
    abortRef.current = new AbortController();
    try {
      await sendTurn(id, content, () => {}, abortRef.current.signal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The line went quiet.");
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  async function onRegen(assistantId: string) {
    if (pending) return;
    setPending(true);
    setError(null);
    abortRef.current = new AbortController();
    try {
      await regenerate(id, assistantId, () => {}, abortRef.current.signal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not regenerate.");
    } finally {
      setPending(false);
    }
  }

  async function onEditSubmit(messageId: string, content: string) {
    const next = editUserMessage(id, messageId, content);
    setEditingId(null);
    if (next) await send(content);
  }

  return (
    <main className="relative flex h-dvh flex-col bg-bg">
      {hero?.image || story.image ? (
        <img
          src={hero?.image || story.image}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-80"
        />
      ) : null}
      <div className="grain" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/55 to-bg" />

      <header className="relative z-20 flex items-center gap-1 px-1 pt-2 pr-24">
        <button
          type="button"
          onClick={() => navigate({ to: "/chats" })}
          aria-label="Back"
          className="flex size-11 items-center justify-center text-fg"
        >
          <ChevronLeft className="size-6" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/story/$id", params: { id } })}
          className="min-w-0 flex-1 text-left"
        >
          <p className="truncate font-display text-lg leading-tight">{hero?.name || story.name}</p>
          <p className="truncate text-xs text-muted">
            {hero && (story.characterIds.length === 1 || story.name === hero.name)
              ? story.description || hero.creatorNotes
              : hero
                ? story.name
                : cast.map((c) => c.name).join(" · ")}
          </p>
        </button>
        <button
          type="button"
          onClick={() => setPanel(panel === "map" ? "none" : "map")}
          aria-label="Story map"
          className="flex size-11 items-center justify-center text-muted"
        >
          <GitBranch className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setPanel(panel === "quick" ? "none" : "quick")}
          aria-label="Quick settings"
          className="flex size-11 items-center justify-center text-muted"
        >
          <Settings2 className="size-5" />
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 pt-6 pb-2">
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          {transcript.map((m) => {
            const sibs = siblingIndex(messagesMap, m);
            return (
              <article key={m.id} className={cn("max-w-[92%]", m.role === "user" && "ml-auto")}>
                {m.role === "user" ? (
                  <div className="rounded-2xl rounded-br-sm bg-elevated/85 px-4 py-2.5 text-fg backdrop-blur-md">
                    {editingId === m.id ? (
                      <EditBox
                        initial={m.content}
                        onCancel={() => setEditingId(null)}
                        onSave={(v) => onEditSubmit(m.id, v)}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                    )}
                  </div>
                ) : (
                  <RichText
                    text={stripChoices(m.content).body}
                    className="story-prose text-[15px] leading-7 text-fg/95"
                  />
                )}
                <div className={cn("mt-1 flex items-center gap-1 text-subtle", m.role === "user" && "justify-end")}>
                  {sibs.total > 1 ? (
                    <>
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center"
                        aria-label="Previous branch"
                        onClick={() => chat && setChat(switchToSibling(messagesMap, chat, m, -1))}
                      >
                        <ChevronLeft className="size-3.5" />
                      </button>
                      <span className="text-xs tabular-nums">
                        {sibs.index + 1}/{sibs.total}
                      </span>
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center"
                        aria-label="Next branch"
                        onClick={() => chat && setChat(switchToSibling(messagesMap, chat, m, 1))}
                      >
                        <ChevronRight className="size-3.5" />
                      </button>
                    </>
                  ) : null}
                  {m.role === "assistant" && !pending ? (
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center"
                      aria-label="Regenerate"
                      onClick={() => onRegen(m.id)}
                    >
                      <RefreshCw className="size-3.5" />
                    </button>
                  ) : null}
                  {m.role === "user" && !pending ? (
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center"
                      aria-label="Edit message"
                      onClick={() => setEditingId(m.id)}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
          {pending && (!transcript.at(-1) || transcript.at(-1)?.role === "user") ? (
            <p className="text-sm text-muted">Writing…</p>
          ) : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <div ref={endRef} />
        </div>
      </div>

      {lastChoices.length > 0 ? (
        <div className="relative z-20 mx-auto flex w-full max-w-lg flex-col gap-2 px-4 pb-2">
          {lastChoices.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => send(c)}
              className="rounded-lg border border-border bg-surface/80 px-3 py-2.5 text-left text-sm text-fg backdrop-blur-sm"
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative z-20 mx-auto w-full max-w-lg px-3 pb-1">
        <StoryContextChips
          storyId={id}
          onOpen={(tab) => {
            setContextTab(tab ?? "scene");
            setPanel("context");
          }}
        />
      </div>

      <form
        className="relative z-20 mx-auto flex w-full max-w-lg items-end gap-2 px-3 pb-4"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <div className="min-w-0 flex-1 rounded-2xl border border-border bg-surface/80 backdrop-blur-md">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder="Continue the story…"
            className="max-h-40 w-full resize-none bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-subtle"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(draft);
              }
            }}
          />
        </div>
        {pending ? (
          <button
            type="button"
            aria-label="Stop"
            onClick={() => abortRef.current?.abort()}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-elevated text-fg"
          >
            <Square className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Send"
            disabled={!draft.trim()}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-fg text-bg disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        )}
      </form>

      {panel === "context" ? (
        <>
          <button type="button" aria-label="Close" className="absolute inset-0 z-30 bg-bg/60" onClick={() => setPanel("none")} />
          <aside className="absolute inset-x-0 bottom-0 z-40 max-h-[82dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-xl">This scene</p>
              <button type="button" className="flex size-10 items-center justify-center" onClick={() => setPanel("none")} aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <StoryContextPanel storyId={id} onDone={() => setPanel("none")} initialTab={contextTab} />
          </aside>
        </>
      ) : null}

      {panel === "quick" ? (
        <>
          <button type="button" aria-label="Close" className="absolute inset-0 z-30 bg-bg/60" onClick={() => setPanel("none")} />
          <aside className="absolute inset-x-0 bottom-0 z-40 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-xl">Chat settings</p>
              <button type="button" className="flex size-10 items-center justify-center" onClick={() => setPanel("none")} aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <p className="text-xs font-medium tracking-wide text-muted">Generation style</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.values(presets).map((p) => (
                <Chip
                  key={p.id}
                  active={story.presetIds.includes(p.id)}
                  onClick={() => {
                    const has = story.presetIds.includes(p.id);
                    const next = has
                      ? story.presetIds.filter((x) => x !== p.id)
                      : [...story.presetIds, p.id];
                    upsertStory({ ...story, presetIds: next.length ? next : ["preset-balanced"] });
                  }}
                >
                  {p.name}
                </Chip>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              Temperature {composed.temperature.toFixed(2)} · reply up to {composed.maxTokens} tokens
            </p>
            <p className="mt-3 text-xs font-medium tracking-wide text-muted">Context window</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[8000, 16000, 24000, 32000, 65536].map((n) => (
                <Chip
                  key={n}
                  active={story.contextSize === n}
                  onClick={() => upsertStory({ ...story, contextSize: n })}
                >
                  {n >= 1000 ? `${Math.round(n / 1000)}k` : n}
                </Chip>
              ))}
            </div>
            <p className="mt-2 text-xs text-subtle">
              Window size sent to Ollama as num_ctx. Reply length stays separate.
            </p>
            <div className="mt-3 divide-y divide-border">
              <Toggle
                checked={story.memoryMatrix}
                onChange={(v) => upsertStory({ ...story, memoryMatrix: v })}
                label="Memory matrix"
              />
              <Toggle
                checked={story.autoMemories}
                onChange={(v) => upsertStory({ ...story, autoMemories: v })}
                label="Auto memories"
              />
              <Toggle
                checked={story.autoCharacters}
                onChange={(v) => upsertStory({ ...story, autoCharacters: v })}
                label="Auto characters"
              />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button type="button" className="text-left text-sm" onClick={() => setPanel("context")}>
                Change persona, lore, or cast
              </button>
              <Link to="/memories/$id" params={{ id }} className="text-sm text-fg underline-offset-4 hover:underline">
                Open memory matrix
              </Link>
              <Link to="/settings" className="text-sm text-fg underline-offset-4 hover:underline">
                Advanced settings
              </Link>
              <button type="button" className="text-left text-sm" onClick={() => setPanel("debug")}>
                Inspect what the model saw
              </button>
            </div>
          </aside>
        </>
      ) : null}

      {panel === "debug" ? (
        <>
          <button type="button" aria-label="Close" className="absolute inset-0 z-30 bg-bg/60" onClick={() => setPanel("none")} />
          <aside className="absolute inset-x-0 bottom-0 z-40 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4 text-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-xl">Prompt inspector</p>
              <button type="button" className="flex size-10 items-center justify-center" onClick={() => setPanel("none")} aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            {lastTrace ? (
              <>
                <p className="text-muted">
                  ~{lastTrace.totalTokens} tokens · {lastTrace.presetNames.join(", ")} · window {story.contextSize}
                </p>
                <p className="mt-1 text-muted">
                  Memories {lastTrace.memoryIds.length} · Lore {lastTrace.loreIds.length} · Characters {lastTrace.characterIds.length}
                </p>
                {lastTrace.storyState?.tracked || lastTrace.storyState?.presentCharacterIds.length ? (
                  <p className="mt-1 text-muted">
                    Present {(lastTrace.storyState.presentCharacterIds ?? []).length} · location {lastTrace.storyState.location || "—"}
                  </p>
                ) : null}
                <ol className="mt-3 space-y-3">
                  {lastTrace.blocks.filter((b) => b.included).map((b) => (
                    <li key={b.id}>
                      <p className="text-xs uppercase tracking-wide text-subtle">
                        {b.kind} · {b.tokens} tok
                      </p>
                      <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-bg p-2 text-xs text-muted">
                        {b.content.slice(0, 1200)}
                      </pre>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="text-sm text-muted">Send a turn, then open this again to see the exact payload.</p>
            )}
          </aside>
        </>
      ) : null}

      {panel === "map" ? (
        <>
          <button type="button" aria-label="Close" className="absolute inset-0 z-30 bg-bg/60" onClick={() => setPanel("none")} />
          <aside className="absolute inset-x-0 bottom-0 z-40 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-xl">Story map</p>
              <button type="button" className="flex size-10 items-center justify-center" onClick={() => setPanel("none")} aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <StoryMap storyId={id} />
          </aside>
        </>
      ) : null}
    </main>
  );
}

function EditBox({
  initial,
  onSave,
  onCancel,
}: {
  initial: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState(initial);
  return (
    <div>
      <textarea
        value={v}
        onChange={(e) => setV(e.target.value)}
        className="w-full bg-transparent text-sm outline-none"
        rows={3}
      />
      <div className="mt-2 flex gap-2">
        <button type="button" className="text-xs" onClick={() => onSave(v)}>
          Save branch
        </button>
        <button type="button" className="text-xs text-muted" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function StoryMap({ storyId }: { storyId: string }) {
  const story = useNexus((s) => s.stories[storyId]);
  const chat = useNexus((s) => (story ? s.chats[story.chatId] : undefined));
  const messages = useNexus((s) => s.messages);
  const setChat = useNexus((s) => s.setChat);
  const nodes = useMemo(() => {
    if (!chat?.rootMessageId) return [];
    const out: { id: string; depth: number; role: string; preview: string; active: boolean }[] = [];
    const active = new Set(visibleTranscript(chat, messages).map((m) => m.id));
    const walk = (nid: string, depth: number) => {
      const m = messages[nid];
      if (!m) return;
      out.push({
        id: nid,
        depth,
        role: m.role,
        preview: m.content.replace(/\s+/g, " ").slice(0, 88),
        active: active.has(nid),
      });
      Object.values(messages)
        .filter((x) => x.parentId === nid)
        .sort((a, b) => a.createdAt - b.createdAt)
        .forEach((c) => walk(c.id, depth + 1));
    };
    walk(chat.rootMessageId, 0);
    return out;
  }, [chat, messages]);

  if (!chat) return null;
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.id} style={{ paddingLeft: n.depth * 12 }}>
          <button
            type="button"
            onClick={() => setChat({ ...chat, activeLeafId: n.id })}
            className={cn(
              "w-full truncate rounded-md px-2 py-2 text-left text-xs",
              n.active ? "bg-elevated text-fg" : "text-muted",
            )}
          >
            {n.role === "user" ? "You" : "Story"} — {n.preview || "(empty)"}
          </button>
        </li>
      ))}
    </ul>
  );
}
