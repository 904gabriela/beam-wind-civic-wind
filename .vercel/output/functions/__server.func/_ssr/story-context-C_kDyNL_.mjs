import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as MapPin, d as ScrollText, i as UserRound, n as Users, p as Plus } from "../_libs/lucide-react.mjs";
import { d as cn } from "./router-DqXMpz5r.mjs";
import { f as now, h as useNexus } from "./store-Cn-YIMyD.mjs";
import { l as TextInput, n as Chip, u as Toggle } from "./ui-Cqfvzrgq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/story-context-C_kDyNL_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StoryContextPanel({ storyId, onDone, initialTab = "you" }) {
	const [tab, setTab] = (0, import_react.useState)(initialTab);
	const story = useNexus((s) => s.stories[storyId]);
	const personas = useNexus((s) => s.personas);
	const lorebooks = useNexus((s) => s.lorebooks);
	const lore = useNexus((s) => s.lore);
	const characters = useNexus((s) => s.characters);
	const storyState = useNexus((s) => s.storyStates[storyId]);
	const upsertStory = useNexus((s) => s.upsertStory);
	const setStoryState = useNexus((s) => s.setStoryState);
	const personaList = (0, import_react.useMemo)(() => Object.values(personas).sort((a, b) => Number(b.isDefault) - Number(a.isDefault)), [personas]);
	const books = (0, import_react.useMemo)(() => Object.values(lorebooks).sort((a, b) => a.name.localeCompare(b.name)), [lorebooks]);
	const cast = (0, import_react.useMemo)(() => (story?.characterIds ?? []).map((id) => characters[id]).filter(Boolean), [story, characters]);
	const available = (0, import_react.useMemo)(() => Object.values(characters).filter((c) => c.origin !== "discovered" && !story?.characterIds.includes(c.id)), [characters, story]);
	if (!story) return null;
	const attached = new Set(story.lorebookIds ?? []);
	const state = storyState ?? emptyState();
	const tracked = Boolean(state.tracked) || state.presentCharacterIds.length > 0;
	const present = new Set(tracked ? state.presentCharacterIds : story.characterIds);
	function patchState(patch) {
		setStoryState(storyId, {
			...state,
			...patch,
			tracked: true,
			updatedAt: now()
		});
	}
	function togglePresent(id) {
		const next = new Set(present);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		patchState({
			presentCharacterIds: [...next],
			tracked: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex gap-2 overflow-x-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: tab === "you",
					onClick: () => setTab("you"),
					children: "You"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: tab === "scene",
					onClick: () => setTab("scene"),
					children: "Scene"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: tab === "lore",
					onClick: () => setTab("lore"),
					children: "Lore"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: tab === "cast",
					onClick: () => setTab("cast"),
					children: "Cast"
				})
			]
		}),
		tab === "you" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "The AI addresses you as this persona. Import one if you already have a card."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => upsertStory({
						...story,
						personaId: void 0
					}),
					className: cn("rounded-xl border px-3 py-3 text-left text-sm", !story.personaId ? "border-fg bg-elevated text-fg" : "border-border text-muted"),
					children: "No persona"
				}),
				personaList.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						upsertStory({
							...story,
							personaId: p.id
						});
						onDone?.();
					},
					className: cn("rounded-xl border px-3 py-3 text-left", story.personaId === p.id ? "border-fg bg-elevated" : "border-border"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: p.name
						}), p.isDefault ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: "Default"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block line-clamp-2 text-sm text-muted",
						children: p.personality || p.preferences || "No notes yet."
					})]
				}, p.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/personas",
						className: "inline-flex h-10 items-center rounded-md border border-border px-3 text-sm",
						children: "Manage personas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/import",
						search: {
							kind: "persona",
							story: storyId
						},
						className: "inline-flex h-10 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg",
						children: "Import persona"
					})]
				})
			]
		}) : null,
		tab === "scene" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Who is in the room. Lore and memory cannot walk someone in. Tap a name."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: state.location,
					onChange: (e) => patchState({ location: e.target.value }),
					placeholder: "Where are you?",
					"aria-label": "Location"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: state.scene,
					onChange: (e) => patchState({ scene: e.target.value }),
					placeholder: "What's happening?",
					"aria-label": "Scene"
				}),
				cast.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Add cast first, then mark who is here."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: cast.map((c) => {
						const here = present.has(c.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => togglePresent(c.id),
							className: cn("flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2 text-left", here ? "border-fg bg-elevated" : "border-border text-muted"),
							children: [c.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.image,
								alt: "",
								className: "size-10 rounded-md object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-10 items-center justify-center rounded-md bg-elevated text-sm",
								children: c.name.slice(0, 1)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm text-fg",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-subtle",
									children: here ? "In the room" : "Away — will not enter"
								})]
							})]
						}, c.id);
					})
				})
			]
		}) : null,
		tab === "lore" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Lorebooks inject world facts only when their keywords come up. Attach them here — you do not paste them into the chat."
				}),
				books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No lorebooks yet."
				}) : books.map((book) => {
					const count = Object.values(lore).filter((e) => e.lorebookId === book.id).length;
					const on = attached.has(book.id) || book.global;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							checked: on,
							onChange: (v) => {
								const next = v ? uniq([...story.lorebookIds ?? [], book.id]) : (story.lorebookIds ?? []).filter((id) => id !== book.id);
								upsertStory({
									...story,
									lorebookIds: next
								});
							},
							label: `${book.name}${book.global ? " (global)" : ""}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "pb-1 text-xs text-subtle",
							children: [
								count,
								" ",
								count === 1 ? "entry" : "entries",
								book.description ? ` · ${book.description}` : ""
							]
						})]
					}, book.id);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/lorebooks",
						className: "inline-flex h-10 items-center rounded-md border border-border px-3 text-sm",
						children: "Manage lorebooks"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/import",
						search: {
							kind: "lorebook",
							story: storyId
						},
						className: "inline-flex h-10 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg",
						children: "Import lorebook"
					})]
				})
			]
		}) : null,
		tab === "cast" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Characters in this story. Import a card if they are not in the library yet."
				}),
				cast.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border px-3 py-2",
					children: [
						c.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.image,
							alt: "",
							className: "size-10 rounded-md object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-10 items-center justify-center rounded-md bg-elevated text-sm",
							children: c.name.slice(0, 1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-subtle",
								children: c.origin === "discovered" ? "Discovered" : "Cast"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs text-muted",
							onClick: () => upsertStory({
								...story,
								characterIds: story.characterIds.filter((id) => id !== c.id)
							}),
							children: "Remove"
						})
					]
				}, c.id)),
				available.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs font-medium tracking-wide text-muted",
					children: "Add from library"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: available.slice(0, 16).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						onClick: () => upsertStory({
							...story,
							characterIds: [...story.characterIds, c.id]
						}),
						children: c.name
					}, c.id))
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/characters",
						className: "inline-flex h-10 items-center rounded-md border border-border px-3 text-sm",
						children: "Library"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/import",
						search: {
							kind: "character",
							story: storyId
						},
						className: "inline-flex h-10 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg",
						children: "Import character"
					})]
				})
			]
		}) : null
	] });
}
function StoryContextChips({ storyId, onOpen }) {
	const story = useNexus((s) => s.stories[storyId]);
	const personas = useNexus((s) => s.personas);
	const lorebooks = useNexus((s) => s.lorebooks);
	const characters = useNexus((s) => s.characters);
	const storyState = useNexus((s) => s.storyStates[storyId]);
	if (!story) return null;
	const persona = story.personaId ? personas[story.personaId] : void 0;
	const books = (story.lorebookIds ?? []).map((id) => lorebooks[id]).filter(Boolean).concat(Object.values(lorebooks).filter((b) => b.global));
	const uniqueBooks = [...new Map(books.map((b) => [b.id, b])).values()];
	const cast = story.characterIds.map((id) => characters[id]).filter(Boolean);
	const here = Boolean(storyState?.tracked) || (storyState?.presentCharacterIds.length ?? 0) > 0 ? storyState.presentCharacterIds.map((id) => characters[id]?.name).filter(Boolean) : cast.map((c) => c.name);
	const sceneLabel = storyState?.location ? here.length ? `${storyState.location} · ${here.slice(0, 2).join(", ")}` : storyState.location : here.length ? here.slice(0, 2).join(", ") : "Who’s here";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2 overflow-x-auto pb-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onOpen("scene"),
				className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-fg backdrop-blur-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
					sceneLabel,
					here.length > 2 ? ` +${here.length - 2}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onOpen("you"),
				className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-fg backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-3.5" }), persona ? `You · ${persona.name}` : "Set persona"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onOpen("lore"),
				className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-fg backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "size-3.5" }), uniqueBooks.length ? uniqueBooks.length === 1 ? uniqueBooks[0].name : `${uniqueBooks.length} lorebooks` : "Attach lore"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onOpen("cast"),
				className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-fg backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }), cast.length ? "Cast" : "Add cast"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/import",
				search: { story: storyId },
				className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated/90 px-3 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Import"]
			})
		]
	});
}
function emptyState() {
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
		tracked: false
	};
}
function uniq(ids) {
	return [...new Set(ids)];
}
//#endregion
export { StoryContextPanel as n, StoryContextChips as t };
