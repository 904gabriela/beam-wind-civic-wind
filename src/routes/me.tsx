import { Link, createFileRoute } from "@tanstack/react-router";
import { Field, TextArea, TextInput } from "@/components/ui";
import { defaultPersonaId, useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/me")({ component: MePage });

function MePage() {
  const personas = useNexus((s) => s.personas);
  const stories = useNexus((s) => s.stories);
  const characters = useNexus((s) => s.characters);
  const lorebooks = useNexus((s) => s.lorebooks);
  const upsertPersona = useNexus((s) => s.upsertPersona);
  const personaId = defaultPersonaId(personas);
  const persona = personaId ? personas[personaId] : Object.values(personas)[0];

  const chatCount = Object.keys(stories).length;
  const castCount = Object.values(characters).filter((c) => c.origin !== "discovered").length;
  const loreCount = Object.keys(lorebooks).length;

  return (
    <main className="pb-12">
      <header className="px-4 pt-6 pb-4 pr-36 lg:px-8 lg:pr-40">
        <h1 className="font-display text-3xl tracking-tight">Me</h1>
        <p className="mt-1 text-sm text-muted">You, as the other characters see you.</p>
      </header>

      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 lg:px-8">
        {persona ? (
          <>
            <Field label="Name" hint="The name they call you.">
              <TextInput
                value={persona.name}
                onChange={(e) => upsertPersona({ ...persona, name: e.target.value })}
              />
            </Field>
            <Field label="How they see you">
              <TextArea
                value={persona.personality}
                onChange={(e) => upsertPersona({ ...persona, personality: e.target.value })}
                placeholder="A traveler who walks into stories as if they were rooms."
              />
            </Field>
            <Field label="Appearance">
              <TextArea
                value={persona.appearance}
                onChange={(e) => upsertPersona({ ...persona, appearance: e.target.value })}
                placeholder="Optional. What they notice first."
              />
            </Field>
            <Field label="Private notes" hint="Tone, boundaries, how you want to be addressed.">
              <TextArea
                value={persona.preferences}
                onChange={(e) => upsertPersona({ ...persona, preferences: e.target.value })}
              />
            </Field>
          </>
        ) : (
          <p className="text-sm text-muted">No persona yet. Import one, or write it under Personas.</p>
        )}

        <div className="grid grid-cols-3 gap-2">
          <Stat label="Chats" value={chatCount} />
          <Stat label="Characters" value={castCount} />
          <Stat label="Lorebooks" value={loreCount} />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link to="/personas" className="text-sm text-fg underline-offset-4 hover:underline">
            All personas
          </Link>
          <Link to="/import" className="text-sm text-fg underline-offset-4 hover:underline">
            Import a persona or lorebook
          </Link>
          <Link to="/settings" className="text-sm text-muted underline-offset-4 hover:underline">
            Settings and backup
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface px-3 py-4 text-center">
      <p className="font-display text-2xl tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
