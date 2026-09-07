import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button, Field, TextArea, TextInput, Toggle } from "@/components/ui";
import { downloadJson, exportPersona } from "@/lib/nexus/import-export";
import { useHydrated, useNexus } from "@/lib/nexus/store";

export const Route = createFileRoute("/persona/$id")({ component: PersonaEditor });

function PersonaEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const persona = useNexus((s) => s.personas[id]);
  const upsert = useNexus((s) => s.upsertPersona);
  const remove = useNexus((s) => s.deletePersona);
  const storiesMap = useNexus((s) => s.stories);
  const stories = Object.values(storiesMap).filter((st) => st.personaId === id);

  if (!persona) {
    if (!hydrated) return <main className="min-h-dvh bg-bg" />;
    return (
      <main className="px-6 py-20 text-center">
        <p className="font-display text-2xl">Persona missing</p>
        <Link to="/personas" className="mt-3 inline-block text-sm text-muted">
          Personas
        </Link>
      </main>
    );
  }

  function set<K extends keyof typeof persona>(key: K, value: (typeof persona)[K]) {
    upsert({ ...persona, [key]: value });
  }

  return (
    <main className="pb-12">
      <Link
        to="/personas"
        className="inline-flex items-center gap-1 px-4 pt-5 text-sm text-muted lg:px-8"
      >
        <ChevronLeft className="size-4" />
        Personas
      </Link>
      <header className="flex items-end justify-between gap-4 px-4 pt-3 pb-4 pr-28 lg:px-8">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{persona.name}</h1>
          <p className="mt-1 text-sm text-muted">Saved as you type. Attach this from a story or inside chat.</p>
        </div>
      </header>
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 lg:px-8">
        <Field label="Name" hint="The AI addresses you by this name.">
          <TextInput value={persona.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Toggle
          checked={persona.isDefault}
          onChange={(v) => set("isDefault", v)}
          label="Default persona for new stories"
        />
        <Field label="Appearance">
          <TextArea value={persona.appearance} onChange={(e) => set("appearance", e.target.value)} />
        </Field>
        <Field label="Personality">
          <TextArea value={persona.personality} onChange={(e) => set("personality", e.target.value)} />
        </Field>
        <Field label="Background">
          <TextArea value={persona.background} onChange={(e) => set("background", e.target.value)} />
        </Field>
        <Field label="Behavior">
          <TextArea value={persona.behavior} onChange={(e) => set("behavior", e.target.value)} />
        </Field>
        <Field label="Speech style">
          <TextArea value={persona.speechStyle} onChange={(e) => set("speechStyle", e.target.value)} />
        </Field>
        <Field
          label="Preferences"
          hint="Tone, boundaries, how you want to be addressed. Injected whenever this persona is active."
        >
          <TextArea value={persona.preferences} onChange={(e) => set("preferences", e.target.value)} />
        </Field>
        {stories.length ? (
          <section>
            <p className="text-xs font-medium tracking-wide text-muted">Used in</p>
            <ul className="mt-2">
              {stories.map((st) => (
                <li key={st.id}>
                  <Link to="/story/$id" params={{ id: st.id }} className="text-sm underline-offset-4 hover:underline">
                    {st.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="text-sm text-muted">Not attached to a story yet. Open a story and choose this persona under You.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              downloadJson(`${persona.name || "persona"}.json`, exportPersona(persona));
              toast("Persona exported");
            }}
          >
            Export JSON
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              remove(id);
              navigate({ to: "/personas" });
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </main>
  );
}
