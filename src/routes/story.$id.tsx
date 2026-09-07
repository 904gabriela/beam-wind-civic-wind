import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button, Chip, Panel, Toggle } from "@/components/ui";
import { StoryContextPanel } from "@/components/story-context";
import { useHydrated, useNexus } from "@/lib/nexus/store";
import { BUILTIN_PRESETS } from "@/lib/nexus/presets";

export const Route = createFileRoute("/story/$id")({ component: StoryPage });

function StoryPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const story = useNexus((s) => s.stories[id]);
  const characters = useNexus((s) => s.characters);
  const personas = useNexus((s) => s.personas);
  const worlds = useNexus((s) => s.worlds);
  const lorebooks = useNexus((s) => s.lorebooks);
  const presets = useNexus((s) => s.presets);
  const memoriesMap = useNexus((s) => s.memories);
  const state = useNexus((s) => s.storyStates[id]);
  const upsertStory = useNexus((s) => s.upsertStory);
  const deleteStory = useNexus((s) => s.deleteStory);
  const memories = Object.values(memoriesMap).filter((m) => m.storyId === id && m.status !== "deleted");

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

  const persona = story.personaId ? personas[story.personaId] : undefined;
  const world = story.worldId ? worlds[story.worldId] : undefined;
  const books = (story.lorebookIds ?? []).map((bid) => lorebooks[bid]).filter(Boolean);

  function togglePreset(pid: string) {
    const has = story.presetIds.includes(pid);
    const next = has ? story.presetIds.filter((x) => x !== pid) : [...story.presetIds, pid];
    upsertStory({ ...story, presetIds: next.length ? next : ["preset-balanced"] });
  }

  return (
    <main className="pb-10">
      <div className="relative h-[42dvh] min-h-64 overflow-hidden bg-elevated">
        {story.image ? (
          <img src={story.image} alt="" className="size-full object-cover object-top" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
        <Link
          to="/chats"
          className="absolute top-3 left-2 z-10 flex size-11 items-center justify-center text-fg"
          aria-label="Back"
        >
          <ChevronLeft className="size-6" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 lg:px-8">
          <p className="font-display text-3xl text-fg">{story.name}</p>
          <p className="mt-1 max-w-xl text-sm text-muted">{story.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-4 pr-28 lg:px-8 lg:pr-32">
        <Button onClick={() => navigate({ to: "/play/$id", params: { id } })}>Continue chat</Button>
        <Button variant="ghost" onClick={() => navigate({ to: "/memories/$id", params: { id } })}>
          Memories ({memories.length})
        </Button>
        <Link
          to="/import"
          search={{ story: id }}
          className="inline-flex h-11 items-center rounded-md border border-border px-4 text-sm"
        >
          Import into this story
        </Link>
      </div>

      <div className="grid gap-3 px-4 lg:grid-cols-2 lg:px-8">
        <Panel className="lg:col-span-2">
          <p className="text-xs font-medium tracking-wide text-muted">Who is in this story</p>
          <p className="mt-1 text-sm text-muted">
            {persona ? `You are ${persona.name}` : "No persona yet"}
            {books.length ? ` · ${books.map((b) => b.name).join(", ")}` : " · no lorebook attached"}
            {world ? ` · ${world.name}` : ""}
          </p>
          <div className="mt-4">
            <StoryContextPanel storyId={id} />
          </div>
        </Panel>

        <Panel>
          <p className="text-xs font-medium tracking-wide text-muted">Scene</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">World</dt>
              <dd>{world?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Location</dt>
              <dd className="text-right">{state?.location || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Scene</dt>
              <dd className="text-right">{state?.scene || "—"}</dd>
            </div>
          </dl>
        </Panel>
        <Panel>
          <p className="text-xs font-medium tracking-wide text-muted">Generation style</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUILTIN_PRESETS.map((p) => (
              <Chip key={p.id} active={story.presetIds.includes(p.id)} onClick={() => togglePreset(p.id)}>
                {p.name}
              </Chip>
            ))}
            {Object.values(presets)
              .filter((p) => !p.builtin)
              .map((p) => (
                <Chip key={p.id} active={story.presetIds.includes(p.id)} onClick={() => togglePreset(p.id)}>
                  {p.name}
                </Chip>
              ))}
          </div>
          <div className="mt-4 divide-y divide-border">
            <Toggle
              checked={story.autoMemories}
              onChange={(v) => upsertStory({ ...story, autoMemories: v })}
              label="Automatic memories"
            />
            <Toggle
              checked={story.autoCharacters}
              onChange={(v) => upsertStory({ ...story, autoCharacters: v })}
              label="Automatic characters"
            />
            <Toggle
              checked={story.memoryMatrix}
              onChange={(v) => upsertStory({ ...story, memoryMatrix: v })}
              label="Memory matrix"
            />
          </div>
        </Panel>
      </div>

      <div className="px-4 pt-6 lg:px-8">
        <Button
          variant="danger"
          onClick={() => {
            deleteStory(id);
            navigate({ to: "/" });
          }}
        >
          Delete story
        </Button>
      </div>
    </main>
  );
}
