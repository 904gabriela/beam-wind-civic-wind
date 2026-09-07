import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PortraitCard } from "@/components/portrait-card";
import { Button, Chip, Field, TextArea, TextInput } from "@/components/ui";
import { TAGS, withOpeningChoices } from "@/lib/characters";
import { nid, now } from "@/lib/nexus/ids";
import { useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/create")({ component: Create });

function Create() {
  const navigate = useNavigate();
  const upsertCharacter = useNexus((s) => s.upsertCharacter);
  const upsertWorld = useNexus((s) => s.upsertWorld);
  const [kind, setKind] = useState<"character" | "world">("character");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [tagline, setTagline] = useState("");
  const [hook, setHook] = useState("");
  const [greeting, setGreeting] = useState("");
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");
  const [choice3, setChoice3] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const t = now();
    const opening = withOpeningChoices(greeting, [choice1, choice2, choice3]);
    if (kind === "world") {
      const id = nid();
      upsertWorld({
        id,
        name: name.trim(),
        description: [tagline.trim(), hook.trim()].filter(Boolean).join("\n\n"),
        image: image.trim() || undefined,
        greeting: opening,
        createdAt: t,
        updatedAt: t,
      });
      navigate({ to: "/world/$id", params: { id } });
      return;
    }
    const id = nid();
    upsertCharacter({
      id,
      name: name.trim(),
      aliases: handle.trim() ? [handle.trim()] : [],
      description: hook.trim() || tagline.trim(),
      personality: "",
      appearance: "",
      background: hook.trim(),
      history: "",
      behavior: "",
      speechStyle: "",
      likes: "",
      dislikes: "",
      fears: "",
      goals: "",
      secrets: "",
      abilities: "",
      scenario: hook.trim(),
      exampleDialogue: opening,
      systemInstructions: "",
      creatorNotes: tagline.trim(),
      tags,
      image: image.trim() || undefined,
      origin: "manual",
      observedFacts: [],
      confidence: 1,
      createdAt: t,
      updatedAt: t,
    });
    navigate({ to: "/character/$id", params: { id } });
  }

  return (
    <main className="pb-12">
      <header className="px-4 pt-6 pb-4 pr-36 lg:px-8 lg:pr-40">
        <h1 className="font-display text-3xl tracking-tight">Create</h1>
        <p className="mt-1 text-sm text-muted">A character, or a world. Yours either way.</p>
      </header>

      <form onSubmit={onSubmit} className="mx-auto flex max-w-xl flex-col gap-5 px-4 lg:px-8">
        <div className="flex gap-2">
          <Chip active={kind === "character"} onClick={() => setKind("character")}>
            Character
          </Chip>
          <Chip active={kind === "world"} onClick={() => setKind("world")}>
            World
          </Chip>
        </div>

        <PortraitCard
          name={name || (kind === "world" ? "New world" : "New character")}
          image={image || undefined}
          tagline={tagline || hook || "A face the story has not met yet."}
          featured
        />

        <Field label="Name">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={kind === "world" ? "The Ember" : "Mira Vale"}
            required
          />
        </Field>
        {kind === "character" ? (
          <Field label="Handle">
            <TextInput value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="ember" />
          </Field>
        ) : null}
        <Field label="Tagline">
          <TextInput
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="The night pianist who remembers every song you never requested."
          />
        </Field>
        <Field label="Hook">
          <TextArea
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="The tavern is almost empty. She plays as if the room is full."
            className="min-h-24"
          />
        </Field>
        <Field label="Greeting" hint="Spoken when someone starts chatting. *actions* and quotes are styled.">
          <TextArea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder={`*The last note hangs in the rafters like smoke.*\n\n"You're dripping on my floor."`}
            className="min-h-36"
          />
        </Field>
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted">Opening choices</p>
          <div className="flex flex-col gap-2">
            <TextInput value={choice1} onChange={(e) => setChoice1(e.target.value)} placeholder="Sit at the piano bench" />
            <TextInput value={choice2} onChange={(e) => setChoice2(e.target.value)} placeholder="Take a stool at the bar" />
            <TextInput value={choice3} onChange={(e) => setChoice3(e.target.value)} placeholder="Ask what she's playing" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wide text-muted">Portrait</span>
          <TextInput
            value={image.startsWith("data:") ? "" : image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste an image URL, or choose a file"
          />
          <div className="flex items-center gap-3">
            <input
              id="portrait-file"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setImage(String(reader.result ?? ""));
                reader.readAsDataURL(file);
              }}
            />
            <label
              htmlFor="portrait-file"
              className="inline-flex h-11 cursor-pointer items-center rounded-md border border-border px-4 text-sm"
            >
              Choose image
            </label>
            {image.startsWith("data:") ? (
              <span className="text-xs text-subtle">Portrait loaded from file.</span>
            ) : null}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted">Tags</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <Chip key={tag} active={tags.includes(tag)} onClick={() => toggleTag(tag)}>
                {tag}
              </Chip>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={!name.trim()}>
          Create
        </Button>
      </form>
    </main>
  );
}
