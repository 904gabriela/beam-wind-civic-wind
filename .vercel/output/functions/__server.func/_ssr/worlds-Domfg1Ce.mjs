import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as useNexus, m as useHydrated, n as CHARACTERS } from "./store-Cn-YIMyD.mjs";
import { t as PortraitCard } from "./portrait-card-BJk47sy6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/worlds-Domfg1Ce.js
var import_jsx_runtime = require_jsx_runtime();
function Worlds() {
	const hydrated = useHydrated();
	const worldsMap = useNexus((s) => s.worlds);
	const worlds = Object.values(worldsMap).sort((a, b) => a.name.localeCompare(b.name));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-4 px-4 pt-6 pb-3 pr-36 lg:px-8 lg:pr-40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight",
					children: "Worlds"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Places you can walk into."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/create",
					className: "inline-flex h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg",
					children: "New"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto px-4 pb-4 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/library",
						className: "inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted",
						children: "Characters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex h-9 items-center rounded-full bg-fg px-3.5 text-sm font-medium text-bg",
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
			!hydrated && worlds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "banner col-span-2 rounded-xl bg-surface" })
			}) : worlds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-6 py-16 text-center text-sm text-muted",
				children: "Create a world, or open one from Discover."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 px-3 pb-4 lg:grid-cols-4 lg:px-8",
				children: worlds.map((w) => {
					const catalog = CHARACTERS.find((c) => c.id === w.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortraitCard, {
						name: w.name,
						image: w.image,
						tagline: catalog?.tagline || w.description.split("\n")[0],
						featured: Boolean(catalog?.featured),
						to: "/world/$id",
						params: { id: w.id }
					}, w.id);
				})
			})
		]
	});
}
//#endregion
export { Worlds as component };
