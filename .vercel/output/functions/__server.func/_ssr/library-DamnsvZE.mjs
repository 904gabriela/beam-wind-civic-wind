import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as useNexus, m as useHydrated, n as CHARACTERS } from "./store-Cn-YIMyD.mjs";
import { t as PortraitCard } from "./portrait-card-BJk47sy6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-DamnsvZE.js
var import_jsx_runtime = require_jsx_runtime();
function Library() {
	const hydrated = useHydrated();
	const charactersMap = useNexus((s) => s.characters);
	const characters = Object.values(charactersMap).sort((a, b) => a.name.localeCompare(b.name));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-4 px-4 pt-6 pb-3 pr-36 lg:px-8 lg:pr-40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight",
					children: "Library"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Your cast."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/import",
					className: "inline-flex h-11 items-center rounded-md border border-border px-3 text-sm",
					children: "Import"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto px-4 pb-4 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex h-9 items-center rounded-full bg-fg px-3.5 text-sm font-medium text-bg",
						children: "Characters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/worlds",
						className: "inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted",
						children: "Worlds"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/personas",
						className: "inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted",
						children: "Personas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/lorebooks",
						className: "inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted",
						children: "Lorebooks"
					})
				]
			}),
			!hydrated && characters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "portrait rounded-xl bg-surface" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "portrait rounded-xl bg-surface" })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 px-3 pb-4 lg:grid-cols-4 lg:px-8",
				children: characters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortraitCard, {
					name: c.name,
					image: c.image,
					tagline: c.origin === "discovered" ? "Discovered" : c.creatorNotes || CHARACTERS.find((x) => x.id === c.id)?.tagline || c.tags[0],
					to: "/character/$id",
					params: { id: c.id }
				}, c.id))
			})
		]
	});
}
//#endregion
export { Library as component };
