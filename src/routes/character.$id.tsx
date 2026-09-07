import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { RichText, stripChoices } from "@/components/rich-text";
import { PortraitCard } from "@/components/portrait-card";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { CHARACTERS, formatCount, relatedWorlds } from "@/lib/characters";
import { openStoryForCharacter } from "@/lib/nexus/chat-service";
import { useHydrated, useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/character/$id")({ component: CharacterPage });

function CharacterPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const character = useNexus((s) => s.characters[id]);
  const upsert = useNexus((s) => s.upsertCharacter);
  const catalog = CHARACTERS.find((c) => c.id === id);
  const alsoIn = relatedWorlds(character?.name || catalog?.name || "");
  const [editing, setEditing] = useState(false);

  if (!character) {
    if (!hydrated) {
      return (
        <main className="flex min-h-dvh items-center justify-center px-6 text-center">
          <p className="text-sm text-muted">Opening…</p>
        </main>
      );
    }
    return (
      <main className="px-6 py-20 text-center">
        <p className="font-display text-2xl">Character missing</p>
        <Link to="/library" className="mt-3 inline-block text-sm text-muted">
          Library
        </Link>
      </main>
    );
  }

  function set<K extends keyof typeof character>(key: K, value: (typeof character)[K]) {
    upsert({ ...character, [key]: value, updatedAt: Date.now() });
  }

  function startChat() {
    const storyId = openStoryForCharacter(id);
    navigate({ to: "/play/$id", params: { id: storyId } });
  }

  const opening = stripChoices(character.exampleDialogue || catalog?.greeting || "");
  const tags = character.tags.length ? character.tags : catalog?.tags ?? [];

  return (
    <main className="pb-16">
      <div className="relative h-[72dvh] min-h-[28rem] overflow-hidden bg-elevated">
        {character.image ? (
          <img src={character.image} alt="" className="size-full object-cover object-top" />
        ) : (
          <div className="flex size-full items-center justify-center font-display text-7xl text-muted">
            {character.name.slice(0, 1)}
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
          <p className="font-display text-4xl tracking-tight text-fg">{character.name}</p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            {catalog?.tagline || character.creatorNotes || character.description}
          </p>
          <Button className="mt-5 w-full max-w-sm" onClick={startChat}>
            Start chatting
          </Button>
          {catalog ? (
            <p className="mt-3 text-xs text-subtle">
              {formatCount(catalog.chats)} chats · {formatCount(catalog.likes)} likes
            </p>
          ) : character.origin === "imported" ? (
            <p className="mt-3 text-xs text-subtle">Imported card</p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex max-w-xl flex-col gap-8 px-4 pt-8 lg:px-8">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
          {catalog?.bio || character.description}
        </p>

        {alsoIn.length ? (
          <section>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted">Also in</p>
            <div className="grid grid-cols-1 gap-2">
              {alsoIn.map((w) => (
                <PortraitCard
                  key={w.id}
                  name={w.name}
                  image={w.image}
                  tagline={w.tagline}
                  featured
                  to="/world/$id"
                  params={{ id: w.id }}
                />
              ))}
            </div>
          </section>
        ) : null}

        {opening.body ? (
          <section>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted">Opening</p>
            <RichText text={opening.body} className="story-prose text-sm leading-7 text-muted" />
          </section>
        ) : null}

        {character.origin === "discovered" && character.observedFacts.length ? (
          <section>
            <p className="text-xs font-medium tracking-wide text-muted">Observed facts</p>
            <ul className="mt-2 space-y-2">
              {character.observedFacts.map((f) => (
                <li key={f.id} className="rounded-lg bg-surface p-3 text-sm">
                  {f.content}
                  <span className="mt-1 block text-xs text-subtle">
                    confidence {Math.round(f.confidence * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="self-start text-sm text-muted underline-offset-4 hover:underline"
        >
          {editing ? "Hide details" : "Edit details"}
        </button>

        {editing ? (
          <div className="flex flex-col gap-4">
            <Field label="Name">
              <TextInput value={character.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Tagline">
              <TextInput value={character.creatorNotes} onChange={(e) => set("creatorNotes", e.target.value)} />
            </Field>
            <Field label="Image URL">
              <TextInput value={character.image ?? ""} onChange={(e) => set("image", e.target.value)} />
            </Field>
            <Field label="Description">
              <TextArea value={character.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
            <Field label="Personality">
              <TextArea value={character.personality} onChange={(e) => set("personality", e.target.value)} />
            </Field>
            <Field label="Appearance">
              <TextArea value={character.appearance} onChange={(e) => set("appearance", e.target.value)} />
            </Field>
            <Field label="Scenario">
              <TextArea value={character.scenario} onChange={(e) => set("scenario", e.target.value)} />
            </Field>
            <Field label="Greeting">
              <TextArea value={character.exampleDialogue} onChange={(e) => set("exampleDialogue", e.target.value)} />
            </Field>
            <Field label="System instructions">
              <TextArea value={character.systemInstructions} onChange={(e) => set("systemInstructions", e.target.value)} />
            </Field>
          </div>
        ) : null}
      </div>
    </main>
  );
}
