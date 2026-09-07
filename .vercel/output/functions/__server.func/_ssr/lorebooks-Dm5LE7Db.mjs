import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as useNexus, m as useHydrated, o as createBlankLorebook } from "./store-Cn-YIMyD.mjs";
import { a as PageHeader, r as EmptyState, t as Button } from "./ui-Cqfvzrgq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lorebooks-Dm5LE7Db.js
var import_jsx_runtime = require_jsx_runtime();
function LorebooksPage() {
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const booksMap = useNexus((s) => s.lorebooks);
	const loreMap = useNexus((s) => s.lore);
	const storiesMap = useNexus((s) => s.stories);
	const upsert = useNexus((s) => s.upsertLorebook);
	const books = Object.values(booksMap).sort((a, b) => b.updatedAt - a.updatedAt);
	const lore = Object.values(loreMap);
	const stories = Object.values(storiesMap);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Lorebooks",
			subtitle: "World facts that surface when they become relevant.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/import",
					search: { kind: "lorebook" },
					className: "inline-flex h-11 items-center rounded-md border border-border px-3 text-sm",
					children: "Import"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						const book = createBlankLorebook("New lorebook");
						upsert(book);
						navigate({
							to: "/lorebook/$id",
							params: { id: book.id }
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/personas",
					className: "inline-flex h-9 items-center rounded-full bg-elevated px-3.5 text-sm text-muted",
					children: "Personas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex h-9 items-center rounded-full bg-fg px-3.5 text-sm font-medium text-bg",
					children: "Lorebooks"
				})
			]
		}),
		!hydrated && books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 rounded-xl bg-surface" })
		}) : books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No lorebooks yet",
			message: "Import a SillyTavern world-info file, or write entries with keywords. They stay out of chat until the words appear.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/import",
				search: { kind: "lorebook" },
				className: "inline-flex h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg",
				children: "Import a lorebook"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-2 px-4 pb-10 pr-28 lg:px-8 lg:pr-32",
			children: books.map((book) => {
				const count = lore.filter((e) => e.lorebookId === book.id).length;
				const used = stories.filter((s) => s.lorebookIds?.includes(book.id)).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/lorebook/$id",
					params: { id: book.id },
					className: "block rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xl",
									children: book.name
								}),
								book.global ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-elevated px-2 py-0.5 text-xs text-muted",
									children: "Global"
								}) : null,
								!book.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-elevated px-2 py-0.5 text-xs text-danger",
									children: "Off"
								}) : null
							]
						}),
						book.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-sm text-muted",
							children: book.description
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-subtle",
							children: [
								count,
								" ",
								count === 1 ? "entry" : "entries",
								used ? ` · ${used} ${used === 1 ? "story" : "stories"}` : " · not attached yet"
							]
						})
					]
				}) }, book.id);
			})
		})
	] });
}
//#endregion
export { LorebooksPage as component };
