import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ChevronLeft, S as ChevronRight, c as Settings2, f as RefreshCw, h as Pencil, l as Send, s as Square, t as X, y as GitBranch } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as cn, i as Route$2 } from "./router-DqXMpz5r.mjs";
import { h as useNexus, i as composePresets, m as useHydrated } from "./store-Cn-YIMyD.mjs";
import { i as visibleTranscript, n as siblingIndex, r as switchToSibling } from "./chat-tree-Tuo2Ghut.mjs";
import { a as regenerate, n as editUserMessage, o as sendTurn, s as stripChoices, t as RichText } from "./chat-service-DSWsaCyB.mjs";
import { n as Chip, u as Toggle } from "./ui-Cqfvzrgq.mjs";
import { n as StoryContextPanel, t as StoryContextChips } from "./story-context-C_kDyNL_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play._id-BiZOJ_bZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlayPage() {
	const { id } = Route$2.useParams();
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const story = useNexus((s) => s.stories[id]);
	const chat = useNexus((s) => story ? s.chats[story.chatId] : void 0);
	const messagesMap = useNexus((s) => s.messages);
	const characters = useNexus((s) => s.characters);
	const presets = useNexus((s) => s.presets);
	const lastTrace = useNexus((s) => s.lastTrace);
	const memoriesMap = useNexus((s) => s.memories);
	const upsertStory = useNexus((s) => s.upsertStory);
	const setChat = useNexus((s) => s.setChat);
	const memories = Object.values(memoriesMap).filter((m) => m.storyId === id && m.status !== "deleted");
	const [draft, setDraft] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [panel, setPanel] = (0, import_react.useState)("none");
	const [contextTab, setContextTab] = (0, import_react.useState)("you");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const abortRef = (0, import_react.useRef)(null);
	const endRef = (0, import_react.useRef)(null);
	const memCount = (0, import_react.useRef)(memories.length);
	const transcript = (0, import_react.useMemo)(() => visibleTranscript(chat, messagesMap), [chat, messagesMap]);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end"
		});
	}, [
		transcript.length,
		pending,
		transcript.at(-1)?.content
	]);
	(0, import_react.useEffect)(() => {
		if (memories.length > memCount.current) {
			const latest = [...memories].sort((a, b) => b.createdAt - a.createdAt)[0];
			if (latest && latest.importance >= .75 && latest.status === "committed") toast("Memory updated", { description: latest.content });
		}
		memCount.current = memories.length;
	}, [memories]);
	if (!story) {
		if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex min-h-dvh items-center justify-center bg-bg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Opening the scene…"
			})
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex min-h-dvh items-center justify-center px-6 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "This story closed"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-3 inline-block text-sm text-muted",
				children: "Back to Nexus"
			})] })
		});
	}
	const cast = story.characterIds.map((cid) => characters[cid]).filter(Boolean);
	const composed = composePresets(story.presetIds.map((pid) => presets[pid]).filter(Boolean));
	const hero = cast[0];
	const lastAssistant = [...transcript].reverse().find((m) => m.role === "assistant");
	const lastChoices = !pending && lastAssistant ? stripChoices(lastAssistant.content).choices : [];
	async function send(text) {
		const content = text.trim();
		if (!content || pending) return;
		setDraft("");
		setError(null);
		setPending(true);
		abortRef.current = new AbortController();
		try {
			await sendTurn(id, content, () => {}, abortRef.current.signal);
		} catch (err) {
			setError(err instanceof Error ? err.message : "The line went quiet.");
		} finally {
			setPending(false);
			abortRef.current = null;
		}
	}
	async function onRegen(assistantId) {
		if (pending) return;
		setPending(true);
		setError(null);
		abortRef.current = new AbortController();
		try {
			await regenerate(id, assistantId, () => {}, abortRef.current.signal);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not regenerate.");
		} finally {
			setPending(false);
		}
	}
	async function onEditSubmit(messageId, content) {
		const next = editUserMessage(id, messageId, content);
		setEditingId(null);
		if (next) await send(content);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative flex h-dvh flex-col bg-bg",
		children: [
			hero?.image || story.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero?.image || story.image,
				alt: "",
				className: "pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-80"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grain" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/55 to-bg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-20 flex items-center gap-1 px-1 pt-2 pr-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => navigate({ to: "/chats" }),
						"aria-label": "Back",
						className: "flex size-11 items-center justify-center text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
							className: "size-6",
							strokeWidth: 1.8
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => navigate({
							to: "/story/$id",
							params: { id }
						}),
						className: "min-w-0 flex-1 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-display text-lg leading-tight",
							children: hero?.name || story.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted",
							children: hero && (story.characterIds.length === 1 || story.name === hero.name) ? story.description || hero.creatorNotes : hero ? story.name : cast.map((c) => c.name).join(" · ")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPanel(panel === "map" ? "none" : "map"),
						"aria-label": "Story map",
						className: "flex size-11 items-center justify-center text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPanel(panel === "quick" ? "none" : "quick"),
						"aria-label": "Quick settings",
						className: "flex size-11 items-center justify-center text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 flex-1 overflow-y-auto px-4 pt-6 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-lg flex-col gap-4",
					children: [
						transcript.map((m) => {
							const sibs = siblingIndex(messagesMap, m);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: cn("max-w-[92%]", m.role === "user" && "ml-auto"),
								children: [m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-2xl rounded-br-sm bg-elevated/85 px-4 py-2.5 text-fg backdrop-blur-md",
									children: editingId === m.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditBox, {
										initial: m.content,
										onCancel: () => setEditingId(null),
										onSave: (v) => onEditSubmit(m.id, v)
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "whitespace-pre-wrap text-sm leading-relaxed",
										children: m.content
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
									text: stripChoices(m.content).body,
									className: "story-prose text-[15px] leading-7 text-fg/95"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("mt-1 flex items-center gap-1 text-subtle", m.role === "user" && "justify-end"),
									children: [
										sibs.total > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "flex size-8 items-center justify-center",
												"aria-label": "Previous branch",
												onClick: () => chat && setChat(switchToSibling(messagesMap, chat, m, -1)),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs tabular-nums",
												children: [
													sibs.index + 1,
													"/",
													sibs.total
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "flex size-8 items-center justify-center",
												"aria-label": "Next branch",
												onClick: () => chat && setChat(switchToSibling(messagesMap, chat, m, 1)),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" })
											})
										] }) : null,
										m.role === "assistant" && !pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex size-8 items-center justify-center",
											"aria-label": "Regenerate",
											onClick: () => onRegen(m.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" })
										}) : null,
										m.role === "user" && !pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex size-8 items-center justify-center",
											"aria-label": "Edit message",
											onClick: () => setEditingId(m.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
										}) : null
									]
								})]
							}, m.id);
						}),
						pending && (!transcript.at(-1) || transcript.at(-1)?.role === "user") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Writing…"
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })
					]
				})
			}),
			lastChoices.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-20 mx-auto flex w-full max-w-lg flex-col gap-2 px-4 pb-2",
				children: lastChoices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => send(c),
					className: "rounded-lg border border-border bg-surface/80 px-3 py-2.5 text-left text-sm text-fg backdrop-blur-sm",
					children: c
				}, c))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-20 mx-auto w-full max-w-lg px-3 pb-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryContextChips, {
					storyId: id,
					onOpen: (tab) => {
						setContextTab(tab ?? "scene");
						setPanel("context");
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "relative z-20 mx-auto flex w-full max-w-lg items-end gap-2 px-3 pb-4",
				style: { paddingBottom: "max(1rem, env(safe-area-inset-bottom))" },
				onSubmit: (e) => {
					e.preventDefault();
					send(draft);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1 rounded-2xl border border-border bg-surface/80 backdrop-blur-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						rows: 2,
						placeholder: "Continue the story…",
						className: "max-h-40 w-full resize-none bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-subtle",
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								send(draft);
							}
						}
					})
				}), pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Stop",
					onClick: () => abortRef.current?.abort(),
					className: "flex size-11 shrink-0 items-center justify-center rounded-full bg-elevated text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					"aria-label": "Send",
					disabled: !draft.trim(),
					className: "flex size-11 shrink-0 items-center justify-center rounded-full bg-fg text-bg disabled:opacity-40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
				})]
			}),
			panel === "context" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close",
				className: "absolute inset-0 z-30 bg-bg/60",
				onClick: () => setPanel("none")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "absolute inset-x-0 bottom-0 z-40 max-h-[82dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "This scene"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-10 items-center justify-center",
						onClick: () => setPanel("none"),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryContextPanel, {
					storyId: id,
					onDone: () => setPanel("none"),
					initialTab: contextTab
				})]
			})] }) : null,
			panel === "quick" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close",
				className: "absolute inset-0 z-30 bg-bg/60",
				onClick: () => setPanel("none")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "absolute inset-x-0 bottom-0 z-40 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: "Chat settings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-10 items-center justify-center",
							onClick: () => setPanel("none"),
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Generation style"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: Object.values(presets).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: story.presetIds.includes(p.id),
							onClick: () => {
								const next = story.presetIds.includes(p.id) ? story.presetIds.filter((x) => x !== p.id) : [...story.presetIds, p.id];
								upsertStory({
									...story,
									presetIds: next.length ? next : ["preset-balanced"]
								});
							},
							children: p.name
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							"Temperature ",
							composed.temperature.toFixed(2),
							" · reply up to ",
							composed.maxTokens,
							" tokens"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs font-medium tracking-wide text-muted",
						children: "Context window"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: [
							8e3,
							16e3,
							24e3,
							32e3,
							65536
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							active: story.contextSize === n,
							onClick: () => upsertStory({
								...story,
								contextSize: n
							}),
							children: n >= 1e3 ? `${Math.round(n / 1e3)}k` : n
						}, n))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-subtle",
						children: "Window size sent to Ollama as num_ctx. Reply length stays separate."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 divide-y divide-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								checked: story.memoryMatrix,
								onChange: (v) => upsertStory({
									...story,
									memoryMatrix: v
								}),
								label: "Memory matrix"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								checked: story.autoMemories,
								onChange: (v) => upsertStory({
									...story,
									autoMemories: v
								}),
								label: "Auto memories"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								checked: story.autoCharacters,
								onChange: (v) => upsertStory({
									...story,
									autoCharacters: v
								}),
								label: "Auto characters"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-left text-sm",
								onClick: () => setPanel("context"),
								children: "Change persona, lore, or cast"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/memories/$id",
								params: { id },
								className: "text-sm text-fg underline-offset-4 hover:underline",
								children: "Open memory matrix"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/settings",
								className: "text-sm text-fg underline-offset-4 hover:underline",
								children: "Advanced settings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-left text-sm",
								onClick: () => setPanel("debug"),
								children: "Inspect what the model saw"
							})
						]
					})
				]
			})] }) : null,
			panel === "debug" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close",
				className: "absolute inset-0 z-30 bg-bg/60",
				onClick: () => setPanel("none")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "absolute inset-x-0 bottom-0 z-40 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "Prompt inspector"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-10 items-center justify-center",
						onClick: () => setPanel("none"),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}), lastTrace ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted",
						children: [
							"~",
							lastTrace.totalTokens,
							" tokens · ",
							lastTrace.presetNames.join(", "),
							" · window ",
							story.contextSize
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-muted",
						children: [
							"Memories ",
							lastTrace.memoryIds.length,
							" · Lore ",
							lastTrace.loreIds.length,
							" · Characters ",
							lastTrace.characterIds.length
						]
					}),
					lastTrace.storyState?.tracked || lastTrace.storyState?.presentCharacterIds.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-muted",
						children: [
							"Present ",
							(lastTrace.storyState.presentCharacterIds ?? []).length,
							" · location ",
							lastTrace.storyState.location || "—"
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 space-y-3",
						children: lastTrace.blocks.filter((b) => b.included).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs uppercase tracking-wide text-subtle",
							children: [
								b.kind,
								" · ",
								b.tokens,
								" tok"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-1 max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-bg p-2 text-xs text-muted",
							children: b.content.slice(0, 1200)
						})] }, b.id))
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Send a turn, then open this again to see the exact payload."
				})]
			})] }) : null,
			panel === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close",
				className: "absolute inset-0 z-30 bg-bg/60",
				onClick: () => setPanel("none")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "absolute inset-x-0 bottom-0 z-40 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "Story map"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-10 items-center justify-center",
						onClick: () => setPanel("none"),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryMap, { storyId: id })]
			})] }) : null
		]
	});
}
function EditBox({ initial, onSave, onCancel }) {
	const [v, setV] = (0, import_react.useState)(initial);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		value: v,
		onChange: (e) => setV(e.target.value),
		className: "w-full bg-transparent text-sm outline-none",
		rows: 3
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "text-xs",
			onClick: () => onSave(v),
			children: "Save branch"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "text-xs text-muted",
			onClick: onCancel,
			children: "Cancel"
		})]
	})] });
}
function StoryMap({ storyId }) {
	const story = useNexus((s) => s.stories[storyId]);
	const chat = useNexus((s) => story ? s.chats[story.chatId] : void 0);
	const messages = useNexus((s) => s.messages);
	const setChat = useNexus((s) => s.setChat);
	const nodes = (0, import_react.useMemo)(() => {
		if (!chat?.rootMessageId) return [];
		const out = [];
		const active = new Set(visibleTranscript(chat, messages).map((m) => m.id));
		const walk = (nid, depth) => {
			const m = messages[nid];
			if (!m) return;
			out.push({
				id: nid,
				depth,
				role: m.role,
				preview: m.content.replace(/\s+/g, " ").slice(0, 88),
				active: active.has(nid)
			});
			Object.values(messages).filter((x) => x.parentId === nid).sort((a, b) => a.createdAt - b.createdAt).forEach((c) => walk(c.id, depth + 1));
		};
		walk(chat.rootMessageId, 0);
		return out;
	}, [chat, messages]);
	if (!chat) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1",
		children: nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			style: { paddingLeft: n.depth * 12 },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setChat({
					...chat,
					activeLeafId: n.id
				}),
				className: cn("w-full truncate rounded-md px-2 py-2 text-left text-xs", n.active ? "bg-elevated text-fg" : "text-muted"),
				children: [
					n.role === "user" ? "You" : "Story",
					" — ",
					n.preview || "(empty)"
				]
			})
		}, n.id))
	});
}
//#endregion
export { PlayPage as component };
