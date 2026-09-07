import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Search } from "../_libs/lucide-react.mjs";
import { h as useNexus, m as useHydrated, n as CHARACTERS } from "./store-Cn-YIMyD.mjs";
import { t as PortraitCard } from "./portrait-card-BJk47sy6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CoCHHjLD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FEATURED = new Set(CHARACTERS.filter((c) => c.featured).map((c) => c.id));
var CATALOG_ORDER = CHARACTERS.map((c) => c.id);
function Discover() {
	const hydrated = useHydrated();
	const charactersMap = useNexus((s) => s.characters);
	const worldsMap = useNexus((s) => s.worlds);
	const storiesMap = useNexus((s) => s.stories);
	const cards = (0, import_react.useMemo)(() => {
		const people = Object.values(charactersMap).filter((c) => c.origin !== "discovered").map((c) => ({
			id: c.id,
			name: c.name,
			image: c.image,
			tagline: c.creatorNotes || CHARACTERS.find((x) => x.id === c.id)?.tagline || c.description,
			featured: FEATURED.has(c.id),
			kind: "character"
		}));
		const places = Object.values(worldsMap).map((w) => ({
			id: w.id,
			name: w.name,
			image: w.image,
			tagline: CHARACTERS.find((c) => c.id === w.id)?.tagline || w.description.split("\n")[0],
			featured: FEATURED.has(w.id),
			kind: "world"
		}));
		return [...people, ...places].sort((a, b) => {
			const ai = CATALOG_ORDER.indexOf(a.id);
			const bi = CATALOG_ORDER.indexOf(b.id);
			if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
			if (ai === -1) return 1;
			if (bi === -1) return -1;
			return ai - bi;
		});
	}, [charactersMap, worldsMap]);
	const recent = (0, import_react.useMemo)(() => Object.values(storiesMap).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6), [storiesMap]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between px-4 pt-6 pb-3 pr-36 lg:px-8 lg:pr-40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted",
					children: "For you"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight",
					children: "Discover"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/search",
					"aria-label": "Search",
					className: "flex size-11 items-center justify-center text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
				})]
			}),
			recent.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between px-4 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Continue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/chats",
						className: "text-xs text-muted",
						children: "All chats"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto px-4 pb-1 lg:px-8",
					children: recent.map((story) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/play/$id",
						params: { id: story.id },
						className: "relative h-36 w-28 shrink-0 overflow-hidden rounded-xl bg-elevated",
						children: [
							story.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: story.image,
								alt: "",
								className: "size-full object-cover object-top"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "absolute inset-x-0 bottom-0 p-2 font-display text-sm leading-tight",
								children: story.name
							})
						]
					}, story.id))
				})]
			}) : null,
			!hydrated && cards.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 px-3 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "banner col-span-2 rounded-xl bg-surface" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "portrait rounded-xl bg-surface" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "portrait rounded-xl bg-surface" })
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 px-3 pb-4 lg:grid-cols-4 lg:px-8",
				children: cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortraitCard, {
					name: card.name,
					image: card.image,
					tagline: card.tagline,
					featured: card.featured,
					to: card.kind === "world" ? "/world/$id" : "/character/$id",
					params: { id: card.id }
				}, card.id))
			})
		]
	});
}
//#endregion
export { Discover as component };
