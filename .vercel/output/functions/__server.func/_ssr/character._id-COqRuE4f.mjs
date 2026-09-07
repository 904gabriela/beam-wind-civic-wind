import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ChevronLeft } from "../_libs/lucide-react.mjs";
import { c as Route$6 } from "./router-DqXMpz5r.mjs";
import { h as useNexus, m as useHydrated, n as CHARACTERS, p as relatedWorlds, u as formatCount } from "./store-Cn-YIMyD.mjs";
import { r as openStoryForCharacter, s as stripChoices, t as RichText } from "./chat-service-DSWsaCyB.mjs";
import { t as PortraitCard } from "./portrait-card-BJk47sy6.mjs";
import { c as TextArea, i as Field, l as TextInput, t as Button } from "./ui-Cqfvzrgq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/character._id-COqRuE4f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CharacterPage() {
	const { id } = Route$6.useParams();
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const character = useNexus((s) => s.characters[id]);
	const upsert = useNexus((s) => s.upsertCharacter);
	const catalog = CHARACTERS.find((c) => c.id === id);
	const alsoIn = relatedWorlds(character?.name || catalog?.name || "");
	const [editing, setEditing] = (0, import_react.useState)(false);
	if (!character) {
		if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex min-h-dvh items-center justify-center px-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Opening…"
			})
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-6 py-20 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "Character missing"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/library",
				className: "mt-3 inline-block text-sm text-muted",
				children: "Library"
			})]
		});
	}
	function set(key, value) {
		upsert({
			...character,
			[key]: value,
			updatedAt: Date.now()
		});
	}
	function startChat() {
		const storyId = openStoryForCharacter(id);
		navigate({
			to: "/play/$id",
			params: { id: storyId }
		});
	}
	const opening = stripChoices(character.exampleDialogue || catalog?.greeting || "");
	const tags = character.tags.length ? character.tags : catalog?.tags ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-[72dvh] min-h-[28rem] overflow-hidden bg-elevated",
			children: [
				character.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: character.image,
					alt: "",
					className: "size-full object-cover object-top"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-full items-center justify-center font-display text-7xl text-muted",
					children: character.name.slice(0, 1)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grain" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "absolute top-3 left-2 z-10 flex size-11 items-center justify-center text-fg",
					"aria-label": "Back",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 z-10 px-4 pb-8 lg:px-8",
					children: [
						tags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 flex flex-wrap gap-2",
							children: tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-elevated/80 px-3 py-1 text-xs text-muted backdrop-blur-sm",
								children: t
							}, t))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-4xl tracking-tight text-fg",
							children: character.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-lg text-sm leading-relaxed text-muted",
							children: catalog?.tagline || character.creatorNotes || character.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-5 w-full max-w-sm",
							onClick: startChat,
							children: "Start chatting"
						}),
						catalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-subtle",
							children: [
								formatCount(catalog.chats),
								" chats · ",
								formatCount(catalog.likes),
								" likes"
							]
						}) : character.origin === "imported" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-subtle",
							children: "Imported card"
						}) : null
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-xl flex-col gap-8 px-4 pt-8 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap text-sm leading-relaxed text-muted",
					children: catalog?.bio || character.description
				}),
				alsoIn.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: "Also in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-2",
					children: alsoIn.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortraitCard, {
						name: w.name,
						image: w.image,
						tagline: w.tagline,
						featured: true,
						to: "/world/$id",
						params: { id: w.id }
					}, w.id))
				})] }) : null,
				opening.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: "Opening"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
					text: opening.body,
					className: "story-prose text-sm leading-7 text-muted"
				})] }) : null,
				character.origin === "discovered" && character.observedFacts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted",
					children: "Observed facts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: character.observedFacts.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg bg-surface p-3 text-sm",
						children: [f.content, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-xs text-subtle",
							children: [
								"confidence ",
								Math.round(f.confidence * 100),
								"%"
							]
						})]
					}, f.id))
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setEditing((v) => !v),
					className: "self-start text-sm text-muted underline-offset-4 hover:underline",
					children: editing ? "Hide details" : "Edit details"
				}),
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: character.name,
								onChange: (e) => set("name", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tagline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: character.creatorNotes,
								onChange: (e) => set("creatorNotes", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Image URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: character.image ?? "",
								onChange: (e) => set("image", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: character.description,
								onChange: (e) => set("description", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Personality",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: character.personality,
								onChange: (e) => set("personality", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Appearance",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: character.appearance,
								onChange: (e) => set("appearance", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Scenario",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: character.scenario,
								onChange: (e) => set("scenario", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Greeting",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: character.exampleDialogue,
								onChange: (e) => set("exampleDialogue", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "System instructions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: character.systemInstructions,
								onChange: (e) => set("systemInstructions", e.target.value)
							})
						})
					]
				}) : null
			]
		})]
	});
}
//#endregion
export { CharacterPage as component };
