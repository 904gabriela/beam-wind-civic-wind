import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as useNexus } from "./store-Cn-YIMyD.mjs";
import { a as PageHeader, l as TextInput } from "./ui-Cqfvzrgq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-2YyVgov3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function searchAll(opts) {
	const q = opts.query.trim().toLowerCase();
	if (q.length < 1) return [];
	const hits = [];
	const add = (kind, id, title, text) => {
		if (!hay(title, text).includes(q)) return;
		hits.push({
			kind,
			id,
			title,
			snippet: snippet(text || title, q)
		});
	};
	for (const s of opts.stories) add("story", s.id, s.name, s.description);
	for (const c of opts.characters) add("character", c.id, c.name, `${c.description} ${c.personality} ${c.tags.join(" ")}`);
	for (const p of opts.personas) add("persona", p.id, p.name, `${p.personality} ${p.background}`);
	for (const w of opts.worlds) add("world", w.id, w.name, w.description);
	for (const l of opts.lore) add("lore", l.id, l.title, l.content);
	for (const m of opts.memories.filter((m) => m.status !== "deleted")) add("memory", m.id, m.type, m.content);
	return hits.slice(0, 60);
}
function hay(...parts) {
	return parts.join(" ").toLowerCase();
}
function snippet(text, q) {
	const i = text.toLowerCase().indexOf(q);
	if (i < 0) return text.slice(0, 140);
	const start = Math.max(0, i - 40);
	return (start > 0 ? "…" : "") + text.slice(start, start + 160);
}
function SearchPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const storiesMap = useNexus((s) => s.stories);
	const charactersMap = useNexus((s) => s.characters);
	const personasMap = useNexus((s) => s.personas);
	const worldsMap = useNexus((s) => s.worlds);
	const loreMap = useNexus((s) => s.lore);
	const memoriesMap = useNexus((s) => s.memories);
	const stories = Object.values(storiesMap);
	const characters = Object.values(charactersMap);
	const personas = Object.values(personasMap);
	const worlds = Object.values(worldsMap);
	const lore = Object.values(loreMap);
	const memories = Object.values(memoriesMap);
	const hits = (0, import_react.useMemo)(() => searchAll({
		query: q,
		stories,
		characters,
		personas,
		worlds,
		lore,
		memories
	}), [
		q,
		stories,
		characters,
		personas,
		worlds,
		lore,
		memories
	]);
	function open(kind, id) {
		if (kind === "story") navigate({
			to: "/story/$id",
			params: { id }
		});
		else if (kind === "character") navigate({
			to: "/character/$id",
			params: { id }
		});
		else if (kind === "persona") navigate({
			to: "/persona/$id",
			params: { id }
		});
		else if (kind === "lore") {
			const bookId = useNexus.getState().lore[id]?.lorebookId;
			if (bookId) navigate({
				to: "/lorebook/$id",
				params: { id: bookId }
			});
			else navigate({ to: "/lorebooks" });
		} else if (kind === "memory") {
			const storyId = useNexus.getState().memories[id]?.storyId;
			if (storyId) navigate({
				to: "/memories/$id",
				params: { id: storyId }
			});
		} else if (kind === "world") navigate({
			to: "/world/$id",
			params: { id }
		});
		else navigate({ to: "/library" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Search",
		subtitle: "Characters, worlds, chats, personas, lore."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 lg:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search Nexus",
			autoFocus: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 flex flex-col gap-2 pb-10",
			children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => open(h.kind, h.id),
				className: "block w-full rounded-xl border border-border bg-surface p-4 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-subtle",
						children: h.kind
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-medium",
						children: h.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-sm text-muted",
						children: h.snippet
					})
				]
			}) }, `${h.kind}-${h.id}`))
		})]
	})] });
}
//#endregion
export { SearchPage as component };
