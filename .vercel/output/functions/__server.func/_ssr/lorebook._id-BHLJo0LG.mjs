import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as Route$5 } from "./router-DqXMpz5r.mjs";
import { a as createBlankLoreEntry, d as nid, h as useNexus, m as useHydrated } from "./store-Cn-YIMyD.mjs";
import { c as TextArea, i as Field, l as TextInput, n as Chip, t as Button, u as Toggle } from "./ui-Cqfvzrgq.mjs";
import { i as exportLorebook, n as downloadJson, o as importFile } from "./import-export-BYXsSic0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lorebook._id-BHLJo0LG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LorebookEditor() {
	const { id } = Route$5.useParams();
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const fileInput = (0, import_react.useRef)(null);
	const book = useNexus((s) => s.lorebooks[id]);
	const loreMap = useNexus((s) => s.lore);
	const storiesMap = useNexus((s) => s.stories);
	const upsertBook = useNexus((s) => s.upsertLorebook);
	const deleteBook = useNexus((s) => s.deleteLorebook);
	const upsertLore = useNexus((s) => s.upsertLore);
	const deleteLore = useNexus((s) => s.deleteLore);
	const upsertStory = useNexus((s) => s.upsertStory);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("entries");
	const entries = (0, import_react.useMemo)(() => Object.values(loreMap).filter((e) => e.lorebookId === id), [loreMap, id]);
	const stories = (0, import_react.useMemo)(() => Object.values(storiesMap), [storiesMap]);
	if (!book) {
		if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "min-h-dvh bg-bg" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-6 py-20 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "Lorebook missing"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/lorebooks",
				className: "mt-3 inline-block text-sm text-muted",
				children: "Lorebooks"
			})]
		});
	}
	const draft = editing === "new" ? null : editing ? loreMap[editing] : null;
	async function importIntoBook(file) {
		if (!file) return;
		const incoming = (await importFile(file, {
			forceKind: "lorebook",
			filename: file.name
		})).lore;
		if (!incoming.length) {
			toast("No entries found in that file");
			return;
		}
		for (const entry of incoming) upsertLore({
			...entry,
			id: nid(),
			lorebookId: id
		});
		toast(`Added ${incoming.length} ${incoming.length === 1 ? "entry" : "entries"}`);
		if (fileInput.current) fileInput.current.value = "";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/lorebooks",
				className: "inline-flex items-center gap-1 px-4 pt-5 text-sm text-muted lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Lorebooks"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-4 px-4 pt-3 pb-4 pr-28 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight",
					children: book.name || "Untitled lorebook"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						entries.length,
						" ",
						entries.length === 1 ? "entry" : "entries",
						book.global ? " · applies to every story" : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						const entry = createBlankLoreEntry(id);
						upsertLore(entry);
						setEditing(entry.id);
						setTab("entries");
					},
					children: "Entry"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-xl flex-col gap-4 px-4 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: tab === "entries",
						onClick: () => setTab("entries"),
						children: "Entries"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: tab === "settings",
						onClick: () => setTab("settings"),
						children: "Settings"
					})]
				}), tab === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: book.name,
							onChange: (e) => upsertBook({
								...book,
								name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: book.description,
							onChange: (e) => upsertBook({
								...book,
								description: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						checked: book.enabled,
						onChange: (v) => upsertBook({
							...book,
							enabled: v
						}),
						label: "Enabled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						checked: book.global,
						onChange: (v) => upsertBook({
							...book,
							global: v
						}),
						label: "Apply to every story"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium tracking-wide text-muted",
						children: "Attached to stories"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-1",
						children: stories.map((st) => {
							const on = st.lorebookIds?.includes(id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									const next = on ? (st.lorebookIds ?? []).filter((bid) => bid !== id) : [...st.lorebookIds ?? [], id];
									upsertStory({
										...st,
										lorebookIds: next
									});
								},
								className: "flex h-11 items-center justify-between rounded-lg border border-border px-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: st.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: on ? "Attached" : "Off"
								})]
							}, st.id);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => {
								downloadJson(`${book.name || "lorebook"}.json`, exportLorebook(book, entries));
								toast("Lorebook exported");
							},
							children: "Export JSON"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								deleteBook(id);
								navigate({ to: "/lorebooks" });
							},
							children: "Delete lorebook"
						})]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => {
								const entry = createBlankLoreEntry(id);
								upsertLore(entry);
								setEditing(entry.id);
							},
							children: "Add entry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => fileInput.current?.click(),
							children: "Import entries"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileInput,
							type: "file",
							accept: ".json,application/json,.txt",
							className: "sr-only",
							onChange: (e) => void importIntoBook(e.target.files?.[0])
						})
					]
				}), entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Add an entry with a few keywords. When those words appear in the conversation, Nexus injects the content. Constant entries always load."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setEditing(entry.id),
						className: "w-full rounded-xl border border-border bg-surface p-4 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: entry.title || "Untitled"
									}),
									entry.always ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-subtle",
										children: "Always"
									}) : null,
									!entry.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-danger",
										children: "Off"
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-sm text-muted",
								children: entry.content || "Empty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-subtle",
								children: entry.keywords.length ? entry.keywords.join(", ") : "No keywords"
							})
						]
					}), draft?.id === entry.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 rounded-xl border border-border bg-elevated p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: entry.title,
									onChange: (e) => upsertLore({
										...entry,
										title: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Keywords",
									hint: "Comma separated. Matched against recent chat.",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: entry.keywords.join(", "),
										onChange: (e) => upsertLore({
											...entry,
											keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
										})
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Content",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
										value: entry.content,
										onChange: (e) => upsertLore({
											...entry,
											content: e.target.value
										})
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								checked: entry.always,
								onChange: (v) => upsertLore({
									...entry,
									always: v
								}),
								label: "Always include (constant)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								checked: Boolean(entry.preventRecursion),
								onChange: (v) => upsertLore({
									...entry,
									preventRecursion: v
								}),
								label: "Don't pull this in from other entries"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								checked: entry.enabled,
								onChange: (v) => upsertLore({
									...entry,
									enabled: v
								}),
								label: "Enabled"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setEditing(null),
									children: "Done"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sm text-danger",
									onClick: () => {
										deleteLore(entry.id);
										setEditing(null);
									},
									children: "Delete entry"
								})]
							})
						]
					}) : null] }, entry.id))
				})] })]
			})
		]
	});
}
//#endregion
export { LorebookEditor as component };
