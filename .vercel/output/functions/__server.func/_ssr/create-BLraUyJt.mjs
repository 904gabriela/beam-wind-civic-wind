import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as nid, f as now, g as withOpeningChoices, h as useNexus, r as TAGS } from "./store-Cn-YIMyD.mjs";
import { t as PortraitCard } from "./portrait-card-BJk47sy6.mjs";
import { c as TextArea, i as Field, l as TextInput, n as Chip, t as Button } from "./ui-Cqfvzrgq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-BLraUyJt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Create() {
	const navigate = useNavigate();
	const upsertCharacter = useNexus((s) => s.upsertCharacter);
	const upsertWorld = useNexus((s) => s.upsertWorld);
	const [kind, setKind] = (0, import_react.useState)("character");
	const [name, setName] = (0, import_react.useState)("");
	const [handle, setHandle] = (0, import_react.useState)("");
	const [tagline, setTagline] = (0, import_react.useState)("");
	const [hook, setHook] = (0, import_react.useState)("");
	const [greeting, setGreeting] = (0, import_react.useState)("");
	const [choice1, setChoice1] = (0, import_react.useState)("");
	const [choice2, setChoice2] = (0, import_react.useState)("");
	const [choice3, setChoice3] = (0, import_react.useState)("");
	const [image, setImage] = (0, import_react.useState)("");
	const [tags, setTags] = (0, import_react.useState)([]);
	function toggleTag(tag) {
		setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
	}
	function onSubmit(e) {
		e.preventDefault();
		if (!name.trim()) return;
		const t = now();
		const opening = withOpeningChoices(greeting, [
			choice1,
			choice2,
			choice3
		]);
		if (kind === "world") {
			const id = nid();
			upsertWorld({
				id,
				name: name.trim(),
				description: [tagline.trim(), hook.trim()].filter(Boolean).join("\n\n"),
				image: image.trim() || void 0,
				greeting: opening,
				createdAt: t,
				updatedAt: t
			});
			navigate({
				to: "/world/$id",
				params: { id }
			});
			return;
		}
		const id = nid();
		upsertCharacter({
			id,
			name: name.trim(),
			aliases: handle.trim() ? [handle.trim()] : [],
			description: hook.trim() || tagline.trim(),
			personality: "",
			appearance: "",
			background: hook.trim(),
			history: "",
			behavior: "",
			speechStyle: "",
			likes: "",
			dislikes: "",
			fears: "",
			goals: "",
			secrets: "",
			abilities: "",
			scenario: hook.trim(),
			exampleDialogue: opening,
			systemInstructions: "",
			creatorNotes: tagline.trim(),
			tags,
			image: image.trim() || void 0,
			origin: "manual",
			observedFacts: [],
			confidence: 1,
			createdAt: t,
			updatedAt: t
		});
		navigate({
			to: "/character/$id",
			params: { id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-4 pt-6 pb-4 pr-36 lg:px-8 lg:pr-40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-tight",
				children: "Create"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "A character, or a world. Yours either way."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "mx-auto flex max-w-xl flex-col gap-5 px-4 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: kind === "character",
						onClick: () => setKind("character"),
						children: "Character"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: kind === "world",
						onClick: () => setKind("world"),
						children: "World"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortraitCard, {
					name: name || (kind === "world" ? "New world" : "New character"),
					image: image || void 0,
					tagline: tagline || hook || "A face the story has not met yet.",
					featured: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: kind === "world" ? "The Ember" : "Mira Vale",
						required: true
					})
				}),
				kind === "character" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Handle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: handle,
						onChange: (e) => setHandle(e.target.value),
						placeholder: "ember"
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tagline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: tagline,
						onChange: (e) => setTagline(e.target.value),
						placeholder: "The night pianist who remembers every song you never requested."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Hook",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: hook,
						onChange: (e) => setHook(e.target.value),
						placeholder: "The tavern is almost empty. She plays as if the room is full.",
						className: "min-h-24"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Greeting",
					hint: "Spoken when someone starts chatting. *actions* and quotes are styled.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: greeting,
						onChange: (e) => setGreeting(e.target.value),
						placeholder: `*The last note hangs in the rafters like smoke.*\n\n"You're dripping on my floor."`,
						className: "min-h-36"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: "Opening choices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: choice1,
							onChange: (e) => setChoice1(e.target.value),
							placeholder: "Sit at the piano bench"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: choice2,
							onChange: (e) => setChoice2(e.target.value),
							placeholder: "Take a stool at the bar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: choice3,
							onChange: (e) => setChoice3(e.target.value),
							placeholder: "Ask what she's playing"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium tracking-wide text-muted",
							children: "Portrait"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: image.startsWith("data:") ? "" : image,
							onChange: (e) => setImage(e.target.value),
							placeholder: "Paste an image URL, or choose a file"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "portrait-file",
									type: "file",
									accept: "image/*",
									className: "sr-only",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										const reader = new FileReader();
										reader.onload = () => setImage(String(reader.result ?? ""));
										reader.readAsDataURL(file);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "portrait-file",
									className: "inline-flex h-11 cursor-pointer items-center rounded-md border border-border px-4 text-sm",
									children: "Choose image"
								}),
								image.startsWith("data:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-subtle",
									children: "Portrait loaded from file."
								}) : null
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: "Tags"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: TAGS.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: tags.includes(tag),
						onClick: () => toggleTag(tag),
						children: tag
					}, tag))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: !name.trim(),
					children: "Create"
				})
			]
		})]
	});
}
//#endregion
export { Create as component };
