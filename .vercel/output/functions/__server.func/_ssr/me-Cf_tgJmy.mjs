import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as useNexus, l as defaultPersonaId } from "./store-Cn-YIMyD.mjs";
import { c as TextArea, i as Field, l as TextInput } from "./ui-Cqfvzrgq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/me-Cf_tgJmy.js
var import_jsx_runtime = require_jsx_runtime();
function MePage() {
	const personas = useNexus((s) => s.personas);
	const stories = useNexus((s) => s.stories);
	const characters = useNexus((s) => s.characters);
	const lorebooks = useNexus((s) => s.lorebooks);
	const upsertPersona = useNexus((s) => s.upsertPersona);
	const personaId = defaultPersonaId(personas);
	const persona = personaId ? personas[personaId] : Object.values(personas)[0];
	const chatCount = Object.keys(stories).length;
	const castCount = Object.values(characters).filter((c) => c.origin !== "discovered").length;
	const loreCount = Object.keys(lorebooks).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-4 pt-6 pb-4 pr-36 lg:px-8 lg:pr-40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-tight",
				children: "Me"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "You, as the other characters see you."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-xl flex-col gap-5 px-4 lg:px-8",
			children: [
				persona ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						hint: "The name they call you.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: persona.name,
							onChange: (e) => upsertPersona({
								...persona,
								name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "How they see you",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: persona.personality,
							onChange: (e) => upsertPersona({
								...persona,
								personality: e.target.value
							}),
							placeholder: "A traveler who walks into stories as if they were rooms."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Appearance",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: persona.appearance,
							onChange: (e) => upsertPersona({
								...persona,
								appearance: e.target.value
							}),
							placeholder: "Optional. What they notice first."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Private notes",
						hint: "Tone, boundaries, how you want to be addressed.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: persona.preferences,
							onChange: (e) => upsertPersona({
								...persona,
								preferences: e.target.value
							})
						})
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No persona yet. Import one, or write it under Personas."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Chats",
							value: chatCount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Characters",
							value: castCount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Lorebooks",
							value: loreCount
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/personas",
							className: "text-sm text-fg underline-offset-4 hover:underline",
							children: "All personas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/import",
							className: "text-sm text-fg underline-offset-4 hover:underline",
							children: "Import a persona or lorebook"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							className: "text-sm text-muted underline-offset-4 hover:underline",
							children: "Settings and backup"
						})
					]
				})
			]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface px-3 py-4 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl tabular-nums",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted",
			children: label
		})]
	});
}
//#endregion
export { MePage as component };
