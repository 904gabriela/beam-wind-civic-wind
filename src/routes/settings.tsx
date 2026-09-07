import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button, Chip, Field, PageHeader, Panel, TextArea, TextInput, Toggle } from "@/components/ui";
import { exportBackup } from "@/lib/nexus/import-export";
import { nid } from "@/lib/nexus/ids";
import { useNexus } from "@/lib/nexus/store";
import type { ProviderKind } from "@/lib/nexus/types";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const TABS = ["General", "Providers", "Generation", "Memory", "Advanced"] as const;

function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General");
  const settings = useNexus((s) => s.settings);
  const patch = useNexus((s) => s.patchSettings);
  const presets = useNexus((s) => s.presets);
  const upsertPreset = useNexus((s) => s.upsertPreset);
  const logs = useNexus((s) => s.logs);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <main className="pb-12">
      <PageHeader title="Settings" subtitle="Simple in chat. Powerful here." />
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:px-8">
        {TABS.map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
            {t}
          </Chip>
        ))}
      </div>
      <div className="mx-auto max-w-xl px-4 lg:px-8">
        {tab === "General" ? (
          <Panel>
            <Toggle
              checked={settings.debugMode}
              onChange={(v) => patch({ debugMode: v })}
              label="Developer prompt inspector"
            />
            <p className="pt-2 text-sm text-muted">
              Nexus stores stories on this device. There is no account, feed, or public profile.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  const state = useNexus.getState();
                  const blob = new Blob(
                    [
                      exportBackup({
                        stories: state.stories,
                        characters: state.characters,
                        personas: state.personas,
                        worlds: state.worlds,
                        lorebooks: state.lorebooks,
                        lore: state.lore,
                        memories: state.memories,
                        relationships: state.relationships,
                        chats: state.chats,
                        messages: state.messages,
                        storyStates: state.storyStates,
                      }),
                    ],
                    { type: "application/json" },
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "nexus-backup.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export backup
              </Button>
            </div>
          </Panel>
        ) : null}

        {tab === "Providers" ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">The chat never talks to a provider directly. Nexus does.</p>
            {(["xai", "ollama", "openai-compatible"] as ProviderKind[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => patch({ provider: p })}
                className="rounded-xl border border-border bg-surface p-4 text-left"
              >
                <p className="font-medium">
                  {p === "xai" ? "xAI (Grok)" : p === "ollama" ? "Ollama" : "OpenAI-compatible"}
                </p>
                <p className="text-xs text-subtle">{settings.provider === p ? "Active" : "Tap to use"}</p>
              </button>
            ))}
            <Field label="xAI model">
              <TextInput value={settings.xaiModel} onChange={(e) => patch({ xaiModel: e.target.value })} />
            </Field>
            <Field label="Ollama URL">
              <TextInput value={settings.ollamaBaseUrl} onChange={(e) => patch({ ollamaBaseUrl: e.target.value })} />
            </Field>
            <Field label="Ollama model">
              <TextInput value={settings.ollamaModel} onChange={(e) => patch({ ollamaModel: e.target.value })} />
            </Field>
            <p className="text-xs text-subtle">
              Context window (num_ctx) comes from each story’s context size in chat settings. Reply length is num_predict, from the writing preset — they are not the same knob.
            </p>
            <Field label="OpenAI-compatible base URL">
              <TextInput value={settings.openaiBaseUrl} onChange={(e) => patch({ openaiBaseUrl: e.target.value })} />
            </Field>
            <Field label="OpenAI-compatible model">
              <TextInput value={settings.openaiModel} onChange={(e) => patch({ openaiModel: e.target.value })} />
            </Field>
            <Field label="OpenAI-compatible API key" hint="Stored only on this device.">
              <TextInput
                type="password"
                value={settings.openaiApiKey}
                onChange={(e) => patch({ openaiApiKey: e.target.value })}
              />
            </Field>
          </div>
        ) : null}

        {tab === "Generation" ? (
          <div className="flex flex-col gap-3">
            {Object.values(presets).map((p) => (
              <Panel key={p.id}>
                <button type="button" className="flex w-full items-center justify-between" onClick={() => setEditing(editing === p.id ? null : p.id)}>
                  <span className="font-display text-lg">{p.name}</span>
                  <span className="text-xs text-subtle">{p.builtin ? "Built-in" : "Custom"}</span>
                </button>
                {editing === p.id ? (
                  <div className="mt-3 flex flex-col gap-2">
                    <Field label="Writing instructions">
                      <TextArea
                        value={p.instructions}
                        onChange={(e) => upsertPreset({ ...p, instructions: e.target.value })}
                      />
                    </Field>
                    <Field label="Temperature">
                      <TextInput
                        type="number"
                        step="0.01"
                        value={p.temperature}
                        onChange={(e) => upsertPreset({ ...p, temperature: Number(e.target.value) })}
                      />
                    </Field>
                    <Field label="Response length (tokens)">
                      <TextInput
                        type="number"
                        value={p.maxTokens}
                        onChange={(e) => upsertPreset({ ...p, maxTokens: Number(e.target.value) })}
                      />
                    </Field>
                    <details>
                      <summary className="cursor-pointer text-sm text-muted">Advanced sampling</summary>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <Field label="Top P">
                          <TextInput
                            type="number"
                            step="0.01"
                            value={p.topP}
                            onChange={(e) => upsertPreset({ ...p, topP: Number(e.target.value) })}
                          />
                        </Field>
                        <Field label="Top K">
                          <TextInput
                            type="number"
                            value={p.topK ?? 0}
                            onChange={(e) => upsertPreset({ ...p, topK: Number(e.target.value) })}
                          />
                        </Field>
                      </div>
                    </details>
                  </div>
                ) : null}
              </Panel>
            ))}
            <Button
              variant="ghost"
              onClick={() =>
                upsertPreset({
                  id: nid(),
                  name: "My preset",
                  builtin: false,
                  instructions: "",
                  temperature: 0.85,
                  topP: 0.95,
                  maxTokens: 1000,
                })
              }
            >
              Save a custom preset
            </Button>
          </div>
        ) : null}

        {tab === "Memory" ? (
          <Panel>
            <Toggle
              checked={settings.autoMemoriesGlobal}
              onChange={(v) => patch({ autoMemoriesGlobal: v })}
              label="Allow automatic memories"
            />
            <Toggle
              checked={settings.autoCharactersGlobal}
              onChange={(v) => patch({ autoCharactersGlobal: v })}
              label="Allow automatic characters"
            />
            <p className="pt-3 text-sm text-muted">
              High-confidence observations save themselves. Inferences stay soft or are discarded. You can always edit the matrix.
            </p>
          </Panel>
        ) : null}

        {tab === "Advanced" ? (
          <div className="flex flex-col gap-3">
            <Panel>
              <p className="text-xs font-medium tracking-wide text-muted">Local log</p>
              <ul className="mt-2 max-h-80 space-y-1 overflow-auto text-xs text-muted">
                {logs.slice().reverse().slice(0, 80).map((l) => (
                  <li key={l.at + l.message}>
                    {new Date(l.at).toLocaleTimeString()} {l.message}
                  </li>
                ))}
              </ul>
            </Panel>
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem("nexus-store-v1");
                toast("Storage cleared. Reload to start fresh.");
              }}
            >
              Clear local storage
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
