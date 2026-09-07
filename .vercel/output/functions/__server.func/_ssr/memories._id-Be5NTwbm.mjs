import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as Pin, o as Trash2 } from "../_libs/lucide-react.mjs";
import { d as cn, o as Route$4 } from "./router-DqXMpz5r.mjs";
import { h as useNexus, m as useHydrated } from "./store-Cn-YIMyD.mjs";
import { i as memoryProvenance } from "./context-engine-DVBFw0hf.mjs";
import { a as PageHeader, l as TextInput, n as Chip } from "./ui-Cqfvzrgq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/memories._id-Be5NTwbm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPES = [
	"all",
	"event",
	"relationship_event",
	"promise",
	"secret",
	"fact",
	"conflict",
	"goal"
];
function MemoriesPage() {
	const { id } = Route$4.useParams();
	const hydrated = useHydrated();
	const story = useNexus((s) => s.stories[id]);
	const memoriesMap = useNexus((s) => s.memories);
	const patch = useNexus((s) => s.patchMemory);
	const del = useNexus((s) => s.deleteMemory);
	const all = Object.values(memoriesMap).filter((m) => m.storyId === id && m.status !== "deleted");
	const [q, setQ] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("importance");
	const list = (0, import_react.useMemo)(() => {
		let next = all;
		if (type !== "all") next = next.filter((m) => m.type === type);
		if (q.trim()) {
			const n = q.toLowerCase();
			next = next.filter((m) => m.content.toLowerCase().includes(n));
		}
		next = [...next].sort((a, b) => sort === "importance" ? Number(b.pinned) - Number(a.pinned) || b.importance - a.importance : b.createdAt - a.createdAt);
		return next;
	}, [
		all,
		q,
		type,
		sort
	]);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Memory matrix",
			subtitle: story.name,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/play/$id",
				params: { id },
				className: "text-sm text-muted",
				children: "Back to chat"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search memories"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-2 overflow-x-auto pb-2",
					children: TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: type === t,
						onClick: () => setType(t),
						children: t === "relationship_event" ? "relationship" : t
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mb-3 text-xs text-muted",
					onClick: () => setSort(sort === "importance" ? "recent" : "importance"),
					children: ["Sort: ", sort]
				}),
				list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-12 text-center text-sm text-muted",
					children: "No memories yet. Roleplay, and Nexus will keep what matters."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: list.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							defaultValue: m.content,
							onBlur: (e) => {
								if (e.target.value.trim() !== m.content) patch(m.id, {
									content: e.target.value.trim(),
									summary: e.target.value.trim(),
									manuallyEdited: true
								});
							},
							className: "w-full resize-none bg-transparent text-sm leading-relaxed outline-none",
							rows: 2
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-2 text-xs text-subtle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.type.replace("_", " ") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: memoryProvenance(m) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"importance ",
									Math.round(m.importance * 100),
									"%"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"confidence ",
									Math.round(m.confidence * 100),
									"%"
								] }),
								m.subjects.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.subjects.join(", ") }) : null,
								m.status === "soft" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "soft" }) : null,
								m.manuallyEdited ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "edited" }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-auto flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Pin",
										className: cn("flex size-9 items-center justify-center", m.pinned && "text-fg"),
										onClick: () => patch(m.id, {
											pinned: !m.pinned,
											manuallyEdited: true
										}),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Delete",
										className: "flex size-9 items-center justify-center",
										onClick: () => del(m.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})]
								})
							]
						})]
					}, m.id))
				})
			]
		})]
	});
}
//#endregion
export { MemoriesPage as component };
