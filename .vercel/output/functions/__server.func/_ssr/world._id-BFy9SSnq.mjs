import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-DqXMpz5r.mjs";
import { h as useNexus, m as useHydrated, n as CHARACTERS, u as formatCount } from "./store-Cn-YIMyD.mjs";
import { i as openStoryForWorld, s as stripChoices, t as RichText } from "./chat-service-DSWsaCyB.mjs";
import { c as TextArea, i as Field, l as TextInput, t as Button } from "./ui-Cqfvzrgq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/world._id-BFy9SSnq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WorldPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const world = useNexus((s) => s.worlds[id]);
	const upsert = useNexus((s) => s.upsertWorld);
	const catalog = CHARACTERS.find((c) => c.id === id);
	const [editing, setEditing] = (0, import_react.useState)(false);
	if (!world) {
		if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "min-h-dvh bg-bg" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-6 py-20 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "World missing"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-3 inline-block text-sm text-muted",
				children: "Discover"
			})]
		});
	}
	function startChat() {
		const storyId = openStoryForWorld(id);
		navigate({
			to: "/play/$id",
			params: { id: storyId }
		});
	}
	const opening = stripChoices(world.greeting || catalog?.greeting || "");
	const tags = catalog?.tags ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-[72dvh] min-h-[28rem] overflow-hidden bg-elevated",
			children: [
				world.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: world.image,
					alt: "",
					className: "size-full object-cover object-top"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-full items-center justify-center font-display text-7xl text-muted",
					children: world.name.slice(0, 1)
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
							children: world.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-lg text-sm leading-relaxed text-muted",
							children: catalog?.tagline || world.description.split("\n")[0]
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
						}) : null
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-xl flex-col gap-8 px-4 pt-8 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap text-sm leading-relaxed text-muted",
					children: catalog?.bio || world.description
				}),
				opening.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: "Opening"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
					text: opening.body,
					className: "story-prose text-sm leading-7 text-muted"
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/lorebooks",
						className: "text-sm text-muted underline-offset-4 hover:underline",
						children: "Lorebooks"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setEditing((v) => !v),
						className: "text-sm text-muted underline-offset-4 hover:underline",
						children: editing ? "Hide details" : "Edit details"
					})]
				}),
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: world.name,
								onChange: (e) => upsert({
									...world,
									name: e.target.value,
									updatedAt: Date.now()
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Image URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: world.image ?? "",
								onChange: (e) => upsert({
									...world,
									image: e.target.value,
									updatedAt: Date.now()
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: world.description,
								onChange: (e) => upsert({
									...world,
									description: e.target.value,
									updatedAt: Date.now()
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Greeting",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: world.greeting ?? "",
								onChange: (e) => upsert({
									...world,
									greeting: e.target.value,
									updatedAt: Date.now()
								})
							})
						})
					]
				}) : null
			]
		})]
	});
}
//#endregion
export { WorldPage as component };
