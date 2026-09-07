import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Plus, ScrollText, UserRound, Users } from "lucide-react";
import { Chip, TextInput, Toggle } from "@/components/ui";
import { useNexus } from "@/lib/nexus/store";
import { cn } from "@/lib/utils";
import { now } from "@/lib/nexus/ids";
import type { StoryState } from "@/lib/nexus/types";

type SceneTab = "you" | "scene" | "lore" | "cast";

export function StoryContextPanel({
  storyId,
  onDone,
  initialTab = "you",
}: {
  storyId: string;
  onDone?: () => void;
  initialTab?: SceneTab;
}) {
  const [tab, setTab] = useState<SceneTab>(initialTab);
  const story = useNexus((s) => s.stories[storyId]);
  const personas = useNexus((s) => s.personas);
  const lorebooks = useNexus((s) => s.lorebooks);
  const lore = useNexus((s) => s.lore);
  const characters = useNexus((s) => s.characters);
  const storyState = useNexus((s) => s.storyStates[storyId]);
  const upsertStory = useNexus((s) => s.upsertStory);
  const setStoryState = useNexus((s) => s.setStoryState);

  const personaList = useMemo(
    () => Object.values(personas).sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [personas],
  );
  const books = useMemo(
    () => Object.values(lorebooks).sort((a, b) => a.name.localeCompare(b.name)),
    [lorebooks],
  );
  const cast = useMemo(
    () => (story?.characterIds ?? []).map((id) => characters[id]).filter(Boolean),
    [story, characters],
  );
  const available = useMemo(
    () =>
      Object.values(characters).filter(
        (c) => c.origin !== "discovered" && !story?.characterIds.includes(c.id),
      ),
    [characters, story],
  );

  if (!story) return null;

  const attached = new Set(story.lorebookIds ?? []);
  const state = storyState ?? emptyState();
  const tracked = Boolean(state.tracked) || state.presentCharacterIds.length > 0;
  const present = new Set(tracked ? state.presentCharacterIds : story.characterIds);

  function patchState(patch: Partial<StoryState>) {
    setStoryState(storyId, {
      ...state,
      ...patch,
      tracked: true,
      updatedAt: now(),
    });
  }

  function togglePresent(id: string) {
    const next = new Set(present);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    patchState({ presentCharacterIds: [...next], tracked: true });
  }

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        <Chip active={tab === "you"} onClick={() => setTab("you")}>
          You
        </Chip>
        <Chip active={tab === "scene"} onClick={() => setTab("scene")}>
          Scene
        </Chip>
        <Chip active={tab === "lore"} onClick={() => setTab("lore")}>
          Lore
        </Chip>
        <Chip active={tab === "cast"} onClick={() => setTab("cast")}>
          Cast
        </Chip>
      </div>

      {tab === "you" ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">
            The AI addresses you as this persona. Import one if you already have a card.
          </p>
          <button
            type="button"
            onClick={() => upsertStory({ ...story, personaId: undefined })}
            className={cn(
              "rounded-xl border px-3 py-3 text-left text-sm",
              !story.personaId ? "border-fg bg-elevated text-fg" : "border-border text-muted",
            )}
          >
            No persona
          </button>
          {personaList.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => {
                upsertStory({ ...story, personaId: p.id });
                onDone?.();
              }}
              className={cn(
                "rounded-xl border px-3 py-3 text-left",
                story.personaId === p.id ? "border-fg bg-elevated" : "border-border",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium">{p.name}</span>
                {p.isDefault ? <span className="text-xs text-subtle">Default</span> : null}
              </span>
              <span className="mt-1 block line-clamp-2 text-sm text-muted">
                {p.personality || p.preferences || "No notes yet."}
              </span>
            </button>
          ))}
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/personas"
              className="inline-flex h-10 items-center rounded-md border border-border px-3 text-sm"
            >
              Manage personas
            </Link>
            <Link
              to="/import"
              search={{ kind: "persona", story: storyId }}
              className="inline-flex h-10 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg"
            >
              Import persona
            </Link>
          </div>
        </div>
      ) : null}

      {tab === "scene" ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Who is in the room. Lore and memory cannot walk someone in. Tap a name.
          </p>
          <TextInput
            value={state.location}
            onChange={(e) => patchState({ location: e.target.value })}
            placeholder="Where are you?"
            aria-label="Location"
          />
          <TextInput
            value={state.scene}
            onChange={(e) => patchState({ scene: e.target.value })}
            placeholder="What's happening?"
            aria-label="Scene"
          />
          {cast.length === 0 ? (
            <p className="text-sm text-muted">Add cast first, then mark who is here.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {cast.map((c) => {
                const here = present.has(c.id);
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => togglePresent(c.id)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2 text-left",
                      here ? "border-fg bg-elevated" : "border-border text-muted",
                    )}
                  >
                    {c.image ? (
                      <img src={c.image} alt="" className="size-10 rounded-md object-cover" />
                    ) : (
                      <span className="flex size-10 items-center justify-center rounded-md bg-elevated text-sm">
                        {c.name.slice(0, 1)}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-fg">{c.name}</span>
                      <span className="text-xs text-subtle">{here ? "In the room" : "Away — will not enter"}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {tab === "lore" ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">
            Lorebooks inject world facts only when their keywords come up. Attach them here — you
            do not paste them into the chat.
          </p>
          {books.length === 0 ? (
            <p className="text-sm text-muted">No lorebooks yet.</p>
          ) : (
            books.map((book) => {
              const count = Object.values(lore).filter((e) => e.lorebookId === book.id).length;
              const on = attached.has(book.id) || book.global;
              return (
                <div key={book.id} className="rounded-xl border border-border px-3 py-2">
                  <Toggle
                    checked={on}
                    onChange={(v) => {
                      const next = v
                        ? uniq([...(story.lorebookIds ?? []), book.id])
                        : (story.lorebookIds ?? []).filter((id) => id !== book.id);
                      upsertStory({ ...story, lorebookIds: next });
                    }}
                    label={`${book.name}${book.global ? " (global)" : ""}`}
                  />
                  <p className="pb-1 text-xs text-subtle">
                    {count} {count === 1 ? "entry" : "entries"}
                    {book.description ? ` · ${book.description}` : ""}
                  </p>
                </div>
              );
            })
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/lorebooks"
              className="inline-flex h-10 items-center rounded-md border border-border px-3 text-sm"
            >
              Manage lorebooks
            </Link>
            <Link
              to="/import"
              search={{ kind: "lorebook", story: storyId }}
              className="inline-flex h-10 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg"
            >
              Import lorebook
            </Link>
          </div>
        </div>
      ) : null}

      {tab === "cast" ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">Characters in this story. Import a card if they are not in the library yet.</p>
          {cast.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2">
              {c.image ? (
                <img src={c.image} alt="" className="size-10 rounded-md object-cover" />
              ) : (
                <span className="flex size-10 items-center justify-center rounded-md bg-elevated text-sm">
                  {c.name.slice(0, 1)}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{c.name}</span>
                <span className="text-xs text-subtle">{c.origin === "discovered" ? "Discovered" : "Cast"}</span>
              </span>
              <button
                type="button"
                className="text-xs text-muted"
                onClick={() =>
                  upsertStory({
                    ...story,
                    characterIds: story.characterIds.filter((id) => id !== c.id),
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          {available.length ? (
            <>
              <p className="mt-2 text-xs font-medium tracking-wide text-muted">Add from library</p>
              <div className="flex flex-wrap gap-2">
                {available.slice(0, 16).map((c) => (
                  <Chip
                    key={c.id}
                    onClick={() =>
                      upsertStory({ ...story, characterIds: [...story.characterIds, c.id] })
                    }
                  >
                    {c.name}
                  </Chip>
                ))}
              </div>
            </>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              to="/characters"
              className="inline-flex h-10 items-center rounded-md border border-border px-3 text-sm"
            >
              Library
            </Link>
            <Link
              to="/import"
              search={{ kind: "character", story: storyId }}
              className="inline-flex h-10 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg"
            >
              Import character
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function StoryContextChips({
  storyId,
  onOpen,
}: {
  storyId: string;
  onOpen: (tab?: SceneTab) => void;
}) {
  const story = useNexus((s) => s.stories[storyId]);
  const personas = useNexus((s) => s.personas);
  const lorebooks = useNexus((s) => s.lorebooks);
  const characters = useNexus((s) => s.characters);
  const storyState = useNexus((s) => s.storyStates[storyId]);
  if (!story) return null;
  const persona = story.personaId ? personas[story.personaId] : undefined;
  const books = (story.lorebookIds ?? [])
    .map((id) => lorebooks[id])
    .filter(Boolean)
    .concat(Object.values(lorebooks).filter((b) => b.global));
  const uniqueBooks = [...new Map(books.map((b) => [b.id, b])).values()];
  const cast = story.characterIds.map((id) => characters[id]).filter(Boolean);
  const tracked = Boolean(storyState?.tracked) || (storyState?.presentCharacterIds.length ?? 0) > 0;
  const here = tracked
    ? storyState!.presentCharacterIds.map((id) => characters[id]?.name).filter(Boolean)
    : cast.map((c) => c.name);
  const sceneLabel = storyState?.location
    ? here.length
      ? `${storyState.location} · ${here.slice(0, 2).join(", ")}`
      : storyState.location
    : here.length
      ? here.slice(0, 2).join(", ")
      : "Who’s here";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onOpen("scene")}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-fg backdrop-blur-sm"
      >
        <MapPin className="size-3.5" />
        {sceneLabel}
        {here.length > 2 ? ` +${here.length - 2}` : ""}
      </button>
      <button
        type="button"
        onClick={() => onOpen("you")}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-fg backdrop-blur-sm"
      >
        <UserRound className="size-3.5" />
        {persona ? `You · ${persona.name}` : "Set persona"}
      </button>
      <button
        type="button"
        onClick={() => onOpen("lore")}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-fg backdrop-blur-sm"
      >
        <ScrollText className="size-3.5" />
        {uniqueBooks.length
          ? uniqueBooks.length === 1
            ? uniqueBooks[0].name
          : `${uniqueBooks.length} lorebooks`
          : "Attach lore"}
      </button>
      <button
        type="button"
        onClick={() => onOpen("cast")}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-fg backdrop-blur-sm"
      >
        <Users className="size-3.5" />
        {cast.length ? "Cast" : "Add cast"}
      </button>
      <Link
        to="/import"
        search={{ story: storyId }}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-muted"
      >
        <Plus className="size-3.5" />
        Import
      </Link>
    </div>
  );
}

function emptyState(): StoryState {
  return {
    location: "",
    scene: "",
    presentCharacterIds: [],
    time: "",
    goals: "",
    tension: "",
    recentEvents: "",
    emotionalState: "",
    updatedAt: 0,
    tracked: false,
  };
}

function uniq(ids: string[]): string[] {
  return [...new Set(ids)];
}
