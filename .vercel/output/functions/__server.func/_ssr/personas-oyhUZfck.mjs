import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as useNexus, m as useHydrated, s as createBlankPersona } from "./store-Cn-YIMyD.mjs";
import { a as PageHeader, r as EmptyState, t as Button } from "./ui-Cqfvzrgq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/personas-oyhUZfck.js
var import_jsx_runtime = require_jsx_runtime();
function PersonasPage() {
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const personasMap = useNexus((s) => s.personas);
	const upsertPersona = useNexus((s) => s.upsertPersona);
	const personas = Object.values(personasMap).sort((a, b) => {
		if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
		return b.updatedAt - a.updatedAt;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Personas",
			subtitle: "Who you are in the story.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/import",
					search: { kind: "persona" },
					className: "inline-flex h-11 items-center rounded-md border border-border px-3 text-sm",
					children: "Import"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						const p = createBlankPersona("New persona");
						upsertPersona(p);
						navigate({
							to: "/persona/$id",
							params: { id: p.id }
						});
					},
					children: "New"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 overflow-x-auto px-4 pb-4 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/library",
					className: "inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted",
					children: "Characters"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/worlds",
					className: "inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted",
					children: "Worlds"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex h-9 items-center rounded-full bg-fg px-3.5 text-sm font-medium text-bg",
					children: "Personas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lorebooks",
					className: "inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted",
					children: "Lorebooks"
				})
			]
		}),
		!hydrated && personas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 rounded-xl bg-surface" })
		}) : personas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No personas yet",
			message: "A persona is the character you play. Import a JSON file or write one here, then attach it from a story or chat.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/import",
				search: { kind: "persona" },
				className: "inline-flex h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg",
				children: "Import a persona"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-2 px-4 pb-10 pr-28 lg:px-8 lg:pr-32",
			children: personas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/persona/$id",
				params: { id: p.id },
				className: "block rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl",
						children: p.name
					}), p.isDefault ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-elevated px-2 py-0.5 text-xs text-muted",
						children: "Default"
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-sm text-muted",
					children: p.personality || p.preferences || "No notes yet."
				})]
			}) }, p.id))
		})
	] });
}
//#endregion
export { PersonasPage as component };
