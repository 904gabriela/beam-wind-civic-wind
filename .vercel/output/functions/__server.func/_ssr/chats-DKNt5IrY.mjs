import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as useNexus, m as useHydrated } from "./store-Cn-YIMyD.mjs";
import { i as visibleTranscript } from "./chat-tree-Tuo2Ghut.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chats-DKNt5IrY.js
var import_jsx_runtime = require_jsx_runtime();
function Chats() {
	const hydrated = useHydrated();
	const storiesMap = useNexus((s) => s.stories);
	const chats = useNexus((s) => s.chats);
	const messages = useNexus((s) => s.messages);
	const characters = useNexus((s) => s.characters);
	const list = Object.values(storiesMap).sort((a, b) => b.updatedAt - a.updatedAt);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-4 pt-6 pb-4 pr-36 lg:px-8 lg:pr-40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-tight",
				children: "Chats"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Pick up the scene where you left it."
			})]
		}), !hydrated && list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-52 rounded-xl bg-surface" })
		}) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 py-16 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "No chats yet"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Open someone from Discover and begin."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-3 px-3 pb-6 lg:px-8",
			children: list.map((story) => {
				const last = visibleTranscript(chats[story.chatId], messages).at(-1);
				const faces = story.characterIds.map((id) => characters[id]).filter(Boolean).slice(0, 3);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/play/$id",
					params: { id: story.id },
					className: "relative block overflow-hidden rounded-xl bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-48 w-full sm:h-56",
						children: [
							story.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: story.image,
								alt: "",
								className: "size-full object-cover object-top"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-x-0 bottom-0 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl text-fg",
										children: story.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-sm text-muted",
										children: last?.content.replace(/\s+/g, " ").slice(0, 140) || story.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-subtle",
										children: faces.map((c) => c.name).join(" · ")
									})
								]
							})
						]
					})
				}) }, story.id);
			})
		})]
	});
}
//#endregion
export { Chats as component };
