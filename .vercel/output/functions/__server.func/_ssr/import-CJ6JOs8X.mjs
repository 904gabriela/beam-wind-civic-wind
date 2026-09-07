import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as FileUp } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as cn, l as Route$15, u as KINDS } from "./router-DqXMpz5r.mjs";
import { h as useNexus } from "./store-Cn-YIMyD.mjs";
import { a as PageHeader, c as TextArea, n as Chip, s as Select, t as Button } from "./ui-Cqfvzrgq.mjs";
import { c as sampleLorebookJson, l as samplePersonaJson, o as importFile, s as importPayload, t as IMPORT_KIND_LABELS } from "./import-export-BYXsSic0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-CJ6JOs8X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImportPage() {
	const { kind: forceKind, story: storyFromQuery } = Route$15.useSearch();
	const navigate = useNavigate();
	const fileInput = (0, import_react.useRef)(null);
	const stories = useNexus((s) => s.stories);
	const commitImport = useNexus((s) => s.commitImport);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [parsing, setParsing] = (0, import_react.useState)(false);
	const [raw, setRaw] = (0, import_react.useState)("");
	const [storyId, setStoryId] = (0, import_react.useState)(storyFromQuery ?? "");
	const [pending, setPending] = (0, import_react.useState)([]);
	const [errors, setErrors] = (0, import_react.useState)([]);
	const hint = (0, import_react.useMemo)(() => {
		if (forceKind === "persona") return "Paste persona JSON, or load the sample. It becomes who you are in the story.";
		if (forceKind === "lorebook") return "Paste a lorebook or SillyTavern world-info file. Keywords decide when facts appear.";
		if (forceKind === "character") return "Paste a character card, or drop a PNG card / portrait.";
		return "Paste JSON, load a sample, or drop a card. File pickers may not work in this preview — paste always does.";
	}, [forceKind]);
	async function handleFiles(files) {
		if (!files) return;
		const list = Array.from(files);
		if (!list.length) return;
		setParsing(true);
		setErrors([]);
		const next = [];
		const failures = [];
		for (const file of list) try {
			const bundle = await importFile(file, {
				forceKind,
				filename: file.name
			});
			if (bundle.kind === "unknown" && bundle.warnings.length) failures.push(`${file.name}: ${bundle.warnings[0]}`);
			else next.push(bundle);
		} catch (err) {
			failures.push(`${file.name}: ${err instanceof Error ? err.message : "Could not read file."}`);
		}
		setPending((cur) => [...cur, ...next]);
		setErrors(failures);
		setParsing(false);
		if (fileInput.current) fileInput.current.value = "";
	}
	function queuePaste() {
		const bundle = importPayload(raw, { forceKind });
		if (bundle.kind === "unknown" && bundle.warnings.length && !bundle.characters.length) {
			setErrors(bundle.warnings);
			return;
		}
		setErrors([]);
		setPending((cur) => [...cur, bundle]);
		setRaw("");
	}
	function commit(bundle) {
		const result = commitImport(bundle, { storyId: storyId || void 0 });
		const label = bundle.summary.join(", ") || bundle.title;
		toast(`Loaded ${label}`, { description: storyId ? `Attached to ${stories[storyId]?.name ?? "the story"}.` : void 0 });
		setPending((cur) => cur.filter((b) => b !== bundle));
		if (storyId) {
			navigate({
				to: "/story/$id",
				params: { id: storyId }
			});
			return;
		}
		if (bundle.kind === "persona" && bundle.personas[0]) {
			navigate({
				to: "/persona/$id",
				params: { id: bundle.personas[0].id }
			});
			return;
		}
		if (bundle.kind === "lorebook" && bundle.lorebooks[0]) {
			navigate({
				to: "/lorebook/$id",
				params: { id: bundle.lorebooks[0].id }
			});
			return;
		}
		if (bundle.kind === "character" && bundle.characters[0]) {
			navigate({
				to: "/character/$id",
				params: { id: bundle.characters[0].id }
			});
			return;
		}
		if (result.firstId && bundle.lorebooks[0]) {
			navigate({
				to: "/lorebook/$id",
				params: { id: bundle.lorebooks[0].id }
			});
			return;
		}
		navigate({ to: "/library" });
	}
	function loadSample(rawJson) {
		const bundle = importPayload(rawJson, { forceKind });
		if (bundle.kind === "unknown") {
			setErrors(bundle.warnings);
			return;
		}
		commit(bundle);
	}
	const storyList = Object.values(stories).sort((a, b) => b.updatedAt - a.updatedAt);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Import",
			subtitle: forceKind ? `Load a ${IMPORT_KIND_LABELS[forceKind].toLowerCase()}.` : "Load a persona, lorebook, or character card."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-xl flex-col gap-5 px-4 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: !forceKind,
						onClick: () => navigate({
							to: "/import",
							search: { story: storyId || void 0 }
						}),
						children: "Any"
					}), KINDS.filter((k) => k !== "backup").map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						active: forceKind === k,
						onClick: () => navigate({
							to: "/import",
							search: {
								kind: k,
								story: storyId || void 0
							}
						}),
						children: IMPORT_KIND_LABELS[k]
					}, k))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium tracking-wide text-muted",
						children: "Load a sample"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "These add a real persona or lorebook to your library so you can see them in chat."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [forceKind !== "lorebook" && forceKind !== "character" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => loadSample(samplePersonaJson()),
							children: "Load sample persona — Ash Calder"
						}) : null, forceKind !== "persona" && forceKind !== "character" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => loadSample(sampleLorebookJson()),
							children: "Load sample lorebook — Ashfell"
						}) : null]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldPaste, {
					raw,
					setRaw,
					onPreview: queuePaste,
					hint
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => fileInput.current?.click(),
					onDragOver: (e) => {
						e.preventDefault();
						setDragging(true);
					},
					onDragLeave: () => setDragging(false),
					onDrop: (e) => {
						e.preventDefault();
						setDragging(false);
						handleFiles(e.dataTransfer.files);
					},
					className: cn("flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition-colors duration-150", dragging ? "border-fg bg-elevated" : "border-border bg-surface"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-5 text-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-medium",
							children: parsing ? "Reading…" : "Drop a file here"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-sm text-muted",
							children: "JSON cards, PNG character cards, or a portrait image."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileInput,
					type: "file",
					multiple: true,
					accept: ".json,.txt,.md,.png,.jpg,.jpeg,.webp,application/json,text/plain,image/png,image/jpeg",
					className: "sr-only",
					onChange: (e) => void handleFiles(e.target.files)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Attach to a story (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: storyId,
						onChange: (e) => setStoryId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Library only — attach later from a story or chat"
						}), storyList.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.name
						}, s.id))]
					})]
				}),
				errors.map((err) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger",
					children: err
				}, err)),
				pending.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: [
						"Ready (",
						pending.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: pending.map((bundle, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [
							bundle.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: bundle.image,
								alt: "",
								className: "mb-3 h-28 w-20 rounded-lg object-cover object-top"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs uppercase tracking-wide text-subtle",
								children: [
									IMPORT_KIND_LABELS[bundle.kind],
									" · ",
									bundle.format
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-xl",
								children: bundle.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: bundle.summary.join(" · ") || "Recognised."
							}),
							bundle.personas[0]?.personality ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-3 text-sm text-muted",
								children: bundle.personas[0].personality
							}) : null,
							bundle.lore.slice(0, 3).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									e.title,
									": ",
									e.keywords.join(", ") || "always on"
								]
							}, e.id)),
							bundle.warnings.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-subtle",
								children: w
							}, w)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "mt-3",
								onClick: () => commit(bundle),
								children: ["Add ", bundle.title]
							})
						]
					}, `${bundle.title}-${i}`))
				})] }) : null
			]
		})]
	});
}
function FieldPaste({ raw, setRaw, onPreview, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium tracking-wide text-muted",
				children: "Paste JSON"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
				value: raw,
				onChange: (e) => setRaw(e.target.value),
				placeholder: "{\"name\":\"Ash Calder\",\"personality\":\"Quiet, dry humor…\"}",
				className: "min-h-40"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onPreview,
				disabled: !raw.trim(),
				variant: "ghost",
				children: "Preview paste"
			})
		]
	});
}
//#endregion
export { ImportPage as component };
