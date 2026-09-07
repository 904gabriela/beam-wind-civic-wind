import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Route$3 } from "./router-DqXMpz5r.mjs";
import { h as useNexus, m as useHydrated } from "./store-Cn-YIMyD.mjs";
import { c as TextArea, i as Field, l as TextInput, t as Button, u as Toggle } from "./ui-Cqfvzrgq.mjs";
import { a as exportPersona, n as downloadJson } from "./import-export-BYXsSic0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/persona._id-D_kTYZDU.js
var import_jsx_runtime = require_jsx_runtime();
function PersonaEditor() {
	const { id } = Route$3.useParams();
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const persona = useNexus((s) => s.personas[id]);
	const upsert = useNexus((s) => s.upsertPersona);
	const remove = useNexus((s) => s.deletePersona);
	const storiesMap = useNexus((s) => s.stories);
	const stories = Object.values(storiesMap).filter((st) => st.personaId === id);
	if (!persona) {
		if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "min-h-dvh bg-bg" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-6 py-20 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "Persona missing"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/personas",
				className: "mt-3 inline-block text-sm text-muted",
				children: "Personas"
			})]
		});
	}
	function set(key, value) {
		upsert({
			...persona,
			[key]: value
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/personas",
				className: "inline-flex items-center gap-1 px-4 pt-5 text-sm text-muted lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Personas"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "flex items-end justify-between gap-4 px-4 pt-3 pb-4 pr-28 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight",
					children: persona.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Saved as you type. Attach this from a story or inside chat."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-xl flex-col gap-4 px-4 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						hint: "The AI addresses you by this name.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: persona.name,
							onChange: (e) => set("name", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						checked: persona.isDefault,
						onChange: (v) => set("isDefault", v),
						label: "Default persona for new stories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Appearance",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: persona.appearance,
							onChange: (e) => set("appearance", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Personality",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: persona.personality,
							onChange: (e) => set("personality", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: persona.background,
							onChange: (e) => set("background", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Behavior",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: persona.behavior,
							onChange: (e) => set("behavior", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Speech style",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: persona.speechStyle,
							onChange: (e) => set("speechStyle", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Preferences",
						hint: "Tone, boundaries, how you want to be addressed. Injected whenever this persona is active.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: persona.preferences,
							onChange: (e) => set("preferences", e.target.value)
						})
					}),
					stories.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Used in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2",
						children: stories.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/story/$id",
							params: { id: st.id },
							className: "text-sm underline-offset-4 hover:underline",
							children: st.name
						}) }, st.id))
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Not attached to a story yet. Open a story and choose this persona under You."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => {
								downloadJson(`${persona.name || "persona"}.json`, exportPersona(persona));
								toast("Persona exported");
							},
							children: "Export JSON"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								remove(id);
								navigate({ to: "/personas" });
							},
							children: "Delete"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { PersonaEditor as component };
