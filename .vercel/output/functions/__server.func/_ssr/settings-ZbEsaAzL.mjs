import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as nid, h as useNexus } from "./store-Cn-YIMyD.mjs";
import { a as PageHeader, c as TextArea, i as Field, l as TextInput, n as Chip, o as Panel, t as Button, u as Toggle } from "./ui-Cqfvzrgq.mjs";
import { r as exportBackup } from "./import-export-BYXsSic0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-ZbEsaAzL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"General",
	"Providers",
	"Generation",
	"Memory",
	"Advanced"
];
function SettingsPage() {
	const [tab, setTab] = (0, import_react.useState)("General");
	const settings = useNexus((s) => s.settings);
	const patch = useNexus((s) => s.patchSettings);
	const presets = useNexus((s) => s.presets);
	const upsertPreset = useNexus((s) => s.upsertPreset);
	const logs = useNexus((s) => s.logs);
	const [editing, setEditing] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Settings",
				subtitle: "Simple in chat. Powerful here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto px-4 pb-4 lg:px-8",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: tab === t,
					onClick: () => setTab(t),
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-xl px-4 lg:px-8",
				children: [
					tab === "General" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							checked: settings.debugMode,
							onChange: (v) => patch({ debugMode: v }),
							label: "Developer prompt inspector"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pt-2 text-sm text-muted",
							children: "Nexus stores stories on this device. There is no account, feed, or public profile."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-col gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => {
									const state = useNexus.getState();
									const blob = new Blob([exportBackup({
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
										storyStates: state.storyStates
									})], { type: "application/json" });
									const url = URL.createObjectURL(blob);
									const a = document.createElement("a");
									a.href = url;
									a.download = "nexus-backup.json";
									a.click();
									URL.revokeObjectURL(url);
								},
								children: "Export backup"
							})
						})
					] }) : null,
					tab === "Providers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "The chat never talks to a provider directly. Nexus does."
							}),
							[
								"xai",
								"ollama",
								"openai-compatible"
							].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => patch({ provider: p }),
								className: "rounded-xl border border-border bg-surface p-4 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: p === "xai" ? "xAI (Grok)" : p === "ollama" ? "Ollama" : "OpenAI-compatible"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: settings.provider === p ? "Active" : "Tap to use"
								})]
							}, p)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "xAI model",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: settings.xaiModel,
									onChange: (e) => patch({ xaiModel: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Ollama URL",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: settings.ollamaBaseUrl,
									onChange: (e) => patch({ ollamaBaseUrl: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Ollama model",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: settings.ollamaModel,
									onChange: (e) => patch({ ollamaModel: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: "Context window (num_ctx) comes from each story’s context size in chat settings. Reply length is num_predict, from the writing preset — they are not the same knob."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "OpenAI-compatible base URL",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: settings.openaiBaseUrl,
									onChange: (e) => patch({ openaiBaseUrl: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "OpenAI-compatible model",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: settings.openaiModel,
									onChange: (e) => patch({ openaiModel: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "OpenAI-compatible API key",
								hint: "Stored only on this device.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									type: "password",
									value: settings.openaiApiKey,
									onChange: (e) => patch({ openaiApiKey: e.target.value })
								})
							})
						]
					}) : null,
					tab === "Generation" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [Object.values(presets).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full items-center justify-between",
							onClick: () => setEditing(editing === p.id ? null : p.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-subtle",
								children: p.builtin ? "Built-in" : "Custom"
							})]
						}), editing === p.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Writing instructions",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
										value: p.instructions,
										onChange: (e) => upsertPreset({
											...p,
											instructions: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Temperature",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										type: "number",
										step: "0.01",
										value: p.temperature,
										onChange: (e) => upsertPreset({
											...p,
											temperature: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Response length (tokens)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										type: "number",
										value: p.maxTokens,
										onChange: (e) => upsertPreset({
											...p,
											maxTokens: Number(e.target.value)
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
									className: "cursor-pointer text-sm text-muted",
									children: "Advanced sampling"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Top P",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
											type: "number",
											step: "0.01",
											value: p.topP,
											onChange: (e) => upsertPreset({
												...p,
												topP: Number(e.target.value)
											})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Top K",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
											type: "number",
											value: p.topK ?? 0,
											onChange: (e) => upsertPreset({
												...p,
												topK: Number(e.target.value)
											})
										})
									})]
								})] })
							]
						}) : null] }, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => upsertPreset({
								id: nid(),
								name: "My preset",
								builtin: false,
								instructions: "",
								temperature: .85,
								topP: .95,
								maxTokens: 1e3
							}),
							children: "Save a custom preset"
						})]
					}) : null,
					tab === "Memory" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							checked: settings.autoMemoriesGlobal,
							onChange: (v) => patch({ autoMemoriesGlobal: v }),
							label: "Allow automatic memories"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							checked: settings.autoCharactersGlobal,
							onChange: (v) => patch({ autoCharactersGlobal: v }),
							label: "Allow automatic characters"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pt-3 text-sm text-muted",
							children: "High-confidence observations save themselves. Inferences stay soft or are discarded. You can always edit the matrix."
						})
					] }) : null,
					tab === "Advanced" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted",
							children: "Local log"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 max-h-80 space-y-1 overflow-auto text-xs text-muted",
							children: logs.slice().reverse().slice(0, 80).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								new Date(l.at).toLocaleTimeString(),
								" ",
								l.message
							] }, l.at + l.message))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => {
								localStorage.removeItem("nexus-store-v1");
								toast("Storage cleared. Reload to start fresh.");
							},
							children: "Clear local storage"
						})]
					}) : null
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
