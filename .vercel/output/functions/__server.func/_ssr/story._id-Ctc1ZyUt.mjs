import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ChevronLeft } from "../_libs/lucide-react.mjs";
import { r as Route$1 } from "./router-DqXMpz5r.mjs";
import { h as useNexus, m as useHydrated, t as BUILTIN_PRESETS } from "./store-Cn-YIMyD.mjs";
import { n as Chip, o as Panel, t as Button, u as Toggle } from "./ui-Cqfvzrgq.mjs";
import { n as StoryContextPanel } from "./story-context-C_kDyNL_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/story._id-Ctc1ZyUt.js
var import_jsx_runtime = require_jsx_runtime();
function StoryPage() {
	const { id } = Route$1.useParams();
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const story = useNexus((s) => s.stories[id]);
	useNexus((s) => s.characters);
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
		if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "min-h-dvh bg-bg" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-6 py-20 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "Story missing"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-3 inline-block text-sm text-muted",
				children: "Back"
			})]
		});
	}
	const persona = story.personaId ? personas[story.personaId] : void 0;
	const world = story.worldId ? worlds[story.worldId] : void 0;
	const books = (story.lorebookIds ?? []).map((bid) => lorebooks[bid]).filter(Boolean);
	function togglePreset(pid) {
		const next = story.presetIds.includes(pid) ? story.presetIds.filter((x) => x !== pid) : [...story.presetIds, pid];
		upsertStory({
			...story,
			presetIds: next.length ? next : ["preset-balanced"]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-[42dvh] min-h-64 overflow-hidden bg-elevated",
				children: [
					story.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: story.image,
						alt: "",
						className: "size-full object-cover object-top"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/chats",
						className: "absolute top-3 left-2 z-10 flex size-11 items-center justify-center text-fg",
						"aria-label": "Back",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 px-4 pb-4 lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl text-fg",
							children: story.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-xl text-sm text-muted",
							children: story.description
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 px-4 py-4 pr-28 lg:px-8 lg:pr-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => navigate({
							to: "/play/$id",
							params: { id }
						}),
						children: "Continue chat"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: () => navigate({
							to: "/memories/$id",
							params: { id }
						}),
						children: [
							"Memories (",
							memories.length,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/import",
						search: { story: id },
						className: "inline-flex h-11 items-center rounded-md border border-border px-4 text-sm",
						children: "Import into this story"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 px-4 lg:grid-cols-2 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "lg:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted",
								children: "Who is in this story"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									persona ? `You are ${persona.name}` : "No persona yet",
									books.length ? ` · ${books.map((b) => b.name).join(", ")}` : " · no lorebook attached",
									world ? ` · ${world.name}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryContextPanel, { storyId: id })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Scene"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-subtle",
									children: "World"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: world?.name ?? "—" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-subtle",
									children: "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-right",
									children: state?.location || "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-subtle",
									children: "Scene"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-right",
									children: state?.scene || "—"
								})]
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted",
							children: "Generation style"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [BUILTIN_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: story.presetIds.includes(p.id),
								onClick: () => togglePreset(p.id),
								children: p.name
							}, p.id)), Object.values(presets).filter((p) => !p.builtin).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: story.presetIds.includes(p.id),
								onClick: () => togglePreset(p.id),
								children: p.name
							}, p.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 divide-y divide-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									checked: story.autoMemories,
									onChange: (v) => upsertStory({
										...story,
										autoMemories: v
									}),
									label: "Automatic memories"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									checked: story.autoCharacters,
									onChange: (v) => upsertStory({
										...story,
										autoCharacters: v
									}),
									label: "Automatic characters"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									checked: story.memoryMatrix,
									onChange: (v) => upsertStory({
										...story,
										memoryMatrix: v
									}),
									label: "Memory matrix"
								})
							]
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pt-6 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					onClick: () => {
						deleteStory(id);
						navigate({ to: "/" });
					},
					children: "Delete story"
				})
			})
		]
	});
}
//#endregion
export { StoryPage as component };
