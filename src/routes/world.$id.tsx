import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { RichText, stripChoices } from "@/components/rich-text";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { CHARACTERS, formatCount } from "@/lib/characters";
import { openStoryForWorld } from "@/lib/nexus/chat-service";
import { useHydrated, useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/world/$id")({ component: WorldPage });

function WorldPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const world = useNexus((s) => s.worlds[id]);
  const upsert = useNexus((s) => s.upsertWorld);
  const catalog = CHARACTERS.find((c) => c.id === id);
  const [editing, setEditing] = useState(false);

  if (!world) {
    if (!hydrated) return <main className="min-h-dvh bg-bg" />;
    return (
      <main className="px-6 py-20 text-center">
        <p className="font-display text-2xl">World missing</p>
        <Link to="/" className="mt-3 inline-block text-sm text-muted">
          Discover
        </Link>
      </main>
    );
  }

  function startChat() {
    const storyId = openStoryForWorld(id);
    navigate({ to: "/play/$id", params: { id: storyId } });
  }

  const opening = stripChoices(world.greeting || catalog?.greeting || "");
  const tags = catalog?.tags ?? [];

  return (
    <main className="pb-16">
      <div className="relative h-[72dvh] min-h-[28rem] overflow-hidden bg-elevated">
        {world.image ? (
          <img src={world.image} alt="" className="size-full object-cover object-top" />
        ) : (
          <div className="flex size-full items-center justify-center font-display text-7xl text-muted">
            {world.name.slice(0, 1)}
          </div>
        )}
        <div className="grain" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/10" />
        <Link
          to="/"
          className="absolute top-3 left-2 z-10 flex size-11 items-center justify-center text-fg"
          aria-label="Back"
        >
          <ChevronLeft className="size-6" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 lg:px-8">
          {tags.length ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="rounded-full bg-elevated/80 px-3 py-1 text-xs text-muted backdrop-blur-sm">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          <p className="font-display text-4xl tracking-tight text-fg">{world.name}</p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            {catalog?.tagline || world.description.split("\n")[0]}
          </p>
          <Button className="mt-5 w-full max-w-sm" onClick={startChat}>
            Start chatting
          </Button>
          {catalog ? (
            <p className="mt-3 text-xs text-subtle">
              {formatCount(catalog.chats)} chats · {formatCount(catalog.likes)} likes
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex max-w-xl flex-col gap-8 px-4 pt-8 lg:px-8">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
          {catalog?.bio || world.description}
        </p>
        {opening.body ? (
          <section>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted">Opening</p>
            <RichText text={opening.body} className="story-prose text-sm leading-7 text-muted" />
          </section>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Link to="/lorebooks" className="text-sm text-muted underline-offset-4 hover:underline">
            Lorebooks
          </Link>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="text-sm text-muted underline-offset-4 hover:underline"
          >
            {editing ? "Hide details" : "Edit details"}
          </button>
        </div>
        {editing ? (
          <div className="flex flex-col gap-4">
            <Field label="Name">
              <TextInput
                value={world.name}
                onChange={(e) => upsert({ ...world, name: e.target.value, updatedAt: Date.now() })}
              />
            </Field>
            <Field label="Image URL">
              <TextInput
                value={world.image ?? ""}
                onChange={(e) => upsert({ ...world, image: e.target.value, updatedAt: Date.now() })}
              />
            </Field>
            <Field label="Description">
              <TextArea
                value={world.description}
                onChange={(e) => upsert({ ...world, description: e.target.value, updatedAt: Date.now() })}
              />
            </Field>
            <Field label="Greeting">
              <TextArea
                value={world.greeting ?? ""}
                onChange={(e) => upsert({ ...world, greeting: e.target.value, updatedAt: Date.now() })}
              />
            </Field>
          </div>
        ) : null}
      </div>
    </main>
  );
}
