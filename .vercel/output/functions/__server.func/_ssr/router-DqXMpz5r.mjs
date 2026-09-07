import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, R as redirect, S as require_jsx_runtime, _ as createFileRoute, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as TriangleAlert, g as MessageCircle, p as Plus, r as User, v as Library, x as Compass } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DqXMpz5r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var NAV = [
	{
		to: "/",
		label: "Discover",
		icon: Compass,
		exact: true
	},
	{
		to: "/chats",
		label: "Chats",
		icon: MessageCircle,
		exact: false
	},
	{
		to: "/create",
		label: "Create",
		icon: Plus,
		exact: false,
		accent: true
	},
	{
		to: "/library",
		label: "Library",
		icon: Library,
		exact: false
	},
	{
		to: "/me",
		label: "Me",
		icon: User,
		exact: false
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const hideNav = pathname.startsWith("/play/");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto min-h-dvh w-full max-w-6xl bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("min-h-dvh", hideNav ? "pb-0" : "pb-20 lg:pb-0 lg:pl-24"),
			children
		}), !hideNav && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			"aria-label": "Primary",
			className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 backdrop-blur-md lg:hidden",
			style: { paddingBottom: "env(safe-area-inset-bottom)" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mx-auto grid max-w-lg grid-cols-5 px-2 pt-1",
				children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					item,
					pathname
				}) }, item.to))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			"aria-label": "Primary",
			className: "fixed top-0 left-0 z-40 hidden h-dvh w-24 flex-col items-center border-r border-border bg-bg py-8 lg:flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				"aria-label": "Nexus home",
				className: "mb-10 flex size-11 items-center justify-center rounded-full text-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl tracking-tight",
					children: "N"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-1 flex-col items-center gap-2",
				children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					item,
					pathname,
					vertical: true
				}) }, item.to))
			})]
		})] })]
	});
}
function NavLink({ item, pathname, vertical }) {
	const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
	const Icon = item.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.to,
		"aria-current": active ? "page" : void 0,
		className: cn("flex flex-col items-center justify-center gap-1 rounded-xl text-subtle transition-colors duration-150", vertical ? "h-16 w-16" : "h-14 w-full", active && "text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("flex size-10 items-center justify-center rounded-full transition-colors duration-150", item.accent && "bg-fg text-bg", !item.accent && active && "text-fg"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "size-5",
				strokeWidth: active ? 2.2 : 1.8
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium tracking-wide",
			children: item.label
		})]
	});
}
var styles_default = "/assets/styles-r5cJyNPm.css";
var APP_NAME = "Nexus";
var Route$20 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0c0a09"
			},
			{
				name: "description",
				content: "Nexus remembers the story so you can live it."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Outfit:wght@400;500;600&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					theme: "dark",
					position: "top-center",
					toastOptions: { style: {
						background: "#1f1914",
						color: "#f4ece4",
						border: "1px solid color-mix(in oklab, #f2f0eb 12%, transparent)"
					} }
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$18 = () => import("./routes-CoCHHjLD.mjs");
var Route$19 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./characters-BKuSfED1.mjs");
var Route$18 = createFileRoute("/characters")({
	beforeLoad: () => {
		throw redirect({ to: "/library" });
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./chats-DKNt5IrY.mjs");
var Route$17 = createFileRoute("/chats")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./create-BLraUyJt.mjs");
var Route$16 = createFileRoute("/create")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var KINDS = [
	"character",
	"persona",
	"lorebook",
	"backup"
];
var $$splitComponentImporter$14 = () => import("./import-CJ6JOs8X.mjs");
var Route$15 = createFileRoute("/import")({
	validateSearch: (search) => ({
		kind: typeof search.kind === "string" && KINDS.includes(search.kind) ? search.kind : void 0,
		story: typeof search.story === "string" ? search.story : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./library-DamnsvZE.mjs");
var Route$14 = createFileRoute("/library")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./lorebooks-Dm5LE7Db.mjs");
var Route$13 = createFileRoute("/lorebooks")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./me-Cf_tgJmy.mjs");
var Route$12 = createFileRoute("/me")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./personas-oyhUZfck.mjs");
var Route$11 = createFileRoute("/personas")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./search-2YyVgov3.mjs");
var Route$10 = createFileRoute("/search")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./settings-ZbEsaAzL.mjs");
var Route$9 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./worlds-Domfg1Ce.mjs");
var Route$8 = createFileRoute("/worlds")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
/** Ollama /api/chat options. num_ctx is the window; num_predict is the reply. */
function ollamaChatOptions(req) {
	const num_predict = Math.min(req.maxTokens ?? 900, 2e3);
	const num_ctx = Math.max(2048, Math.min(Math.round(req.numCtx ?? 8192), 131072));
	const options = {
		temperature: req.temperature ?? .85,
		top_p: req.topP ?? .95,
		num_predict,
		num_ctx
	};
	if (req.topK && req.topK > 0) options.top_k = req.topK;
	if (req.repeatPenalty && req.repeatPenalty > 0) options.repeat_penalty = req.repeatPenalty;
	return options;
}
function friendlyError(status, provider) {
	if (status === 401 || status === 403) return "The model provider rejected the request.";
	if (status === 404) return "That model was not found.";
	if (status === 429) return "The model is busy. Try again in a moment.";
	if (status >= 500) return `${provider} is unavailable right now.`;
	return "The story stalled. Try again.";
}
async function runProvider(req, stream) {
	const temperature = req.temperature ?? .85;
	const maxTokens = Math.min(req.maxTokens ?? 900, 2e3);
	const topP = req.topP ?? .95;
	if (req.provider === "ollama") return runOllama(req, {
		temperature,
		maxTokens,
		topP,
		stream
	});
	const isXai = req.provider === "xai";
	const apiKey = isXai ? process.env.XAI_API_KEY : req.openaiApiKey;
	const baseUrl = isXai ? "https://api.x.ai/v1" : (req.openaiBaseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
	const model = req.model || (isXai ? "grok-4.5" : "gpt-4o-mini");
	const label = isXai ? "xAI" : "OpenAI-compatible";
	if (!apiKey) return {
		ok: false,
		error: isXai ? "Storytelling is unavailable right now." : "Add an API key in Settings to use this provider."
	};
	const body = {
		model,
		temperature,
		top_p: topP,
		max_tokens: maxTokens,
		messages: req.messages,
		stream
	};
	if (req.json) body.response_format = { type: "json_object" };
	const res = await fetch(`${baseUrl}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) return {
		ok: false,
		error: friendlyError(res.status, label),
		status: res.status
	};
	if (stream) {
		if (!res.body) return {
			ok: false,
			error: "No stream from provider."
		};
		return {
			ok: true,
			stream: res.body
		};
	}
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Silence from the other side. Try again."
	};
	return {
		ok: true,
		text
	};
}
async function runOllama(req, opts) {
	const base = (req.ollamaBaseUrl || "http://127.0.0.1:11434").replace(/\/$/, "");
	req.model || req.ollamaBaseUrl;
	try {
		const res = await fetch(`${base}/api/chat`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: req.model || "llama3.1",
				stream: opts.stream,
				format: req.json ? "json" : void 0,
				options: ollamaChatOptions(req),
				messages: req.messages
			})
		});
		if (!res.ok) return {
			ok: false,
			error: friendlyError(res.status, "Ollama"),
			status: res.status
		};
		if (opts.stream) {
			if (!res.body) return {
				ok: false,
				error: "Ollama returned no stream."
			};
			return {
				ok: true,
				stream: mapOllamaStream(res.body)
			};
		}
		const text = (await res.json()).message?.content?.trim() ?? "";
		if (!text) return {
			ok: false,
			error: "Ollama returned an empty reply."
		};
		return {
			ok: true,
			text
		};
	} catch {
		return {
			ok: false,
			error: `Cannot reach Ollama at ${base}. Start Ollama or switch provider in Settings.`
		};
	}
}
function mapOllamaStream(source) {
	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	let buf = "";
	return new ReadableStream({ async start(controller) {
		const reader = source.getReader();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buf += decoder.decode(value, { stream: true });
				const lines = buf.split("\n");
				buf = lines.pop() ?? "";
				for (const line of lines) {
					if (!line.trim()) continue;
					try {
						const json = JSON.parse(line);
						const piece = json.message?.content ?? "";
						if (piece) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: piece } }] })}\n\n`));
						if (json.done) controller.enqueue(encoder.encode("data: [DONE]\n\n"));
					} catch {}
				}
			}
		} finally {
			controller.close();
		}
	} });
}
var Route$7 = createFileRoute("/api/generate")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid request." }, { status: 400 });
	}
	if (!body?.messages?.length) return Response.json({ error: "Nothing to send." }, { status: 400 });
	const stream = body.stream !== false && !body.json;
	const result = await runProvider(body, stream);
	if (!result.ok) return Response.json({ error: result.error }, { status: result.status ?? 502 });
	if ("text" in result) return Response.json({ text: result.text });
	return new Response(result.stream, { headers: {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive"
	} });
} } } });
var $$splitComponentImporter$6 = () => import("./character._id-COqRuE4f.mjs");
var Route$6 = createFileRoute("/character/$id")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./lorebook._id-BHLJo0LG.mjs");
var Route$5 = createFileRoute("/lorebook/$id")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./memories._id-Be5NTwbm.mjs");
var Route$4 = createFileRoute("/memories/$id")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./persona._id-D_kTYZDU.mjs");
var Route$3 = createFileRoute("/persona/$id")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./play._id-BiZOJ_bZ.mjs");
var Route$2 = createFileRoute("/play/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./story._id-Ctc1ZyUt.mjs");
var Route$1 = createFileRoute("/story/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./world._id-BFy9SSnq.mjs");
var Route = createFileRoute("/world/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$19.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$20
	}),
	CharactersRoute: Route$18.update({
		id: "/characters",
		path: "/characters",
		getParentRoute: () => Route$20
	}),
	ChatsRoute: Route$17.update({
		id: "/chats",
		path: "/chats",
		getParentRoute: () => Route$20
	}),
	CreateRoute: Route$16.update({
		id: "/create",
		path: "/create",
		getParentRoute: () => Route$20
	}),
	ImportRoute: Route$15.update({
		id: "/import",
		path: "/import",
		getParentRoute: () => Route$20
	}),
	LibraryRoute: Route$14.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$20
	}),
	LorebooksRoute: Route$13.update({
		id: "/lorebooks",
		path: "/lorebooks",
		getParentRoute: () => Route$20
	}),
	MeRoute: Route$12.update({
		id: "/me",
		path: "/me",
		getParentRoute: () => Route$20
	}),
	PersonasRoute: Route$11.update({
		id: "/personas",
		path: "/personas",
		getParentRoute: () => Route$20
	}),
	SearchRoute: Route$10.update({
		id: "/search",
		path: "/search",
		getParentRoute: () => Route$20
	}),
	SettingsRoute: Route$9.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$20
	}),
	WorldsRoute: Route$8.update({
		id: "/worlds",
		path: "/worlds",
		getParentRoute: () => Route$20
	}),
	ApiGenerateRoute: Route$7.update({
		id: "/api/generate",
		path: "/api/generate",
		getParentRoute: () => Route$20
	}),
	CharacterIdRoute: Route$6.update({
		id: "/character/$id",
		path: "/character/$id",
		getParentRoute: () => Route$20
	}),
	LorebookIdRoute: Route$5.update({
		id: "/lorebook/$id",
		path: "/lorebook/$id",
		getParentRoute: () => Route$20
	}),
	MemoriesIdRoute: Route$4.update({
		id: "/memories/$id",
		path: "/memories/$id",
		getParentRoute: () => Route$20
	}),
	PersonaIdRoute: Route$3.update({
		id: "/persona/$id",
		path: "/persona/$id",
		getParentRoute: () => Route$20
	}),
	PlayIdRoute: Route$2.update({
		id: "/play/$id",
		path: "/play/$id",
		getParentRoute: () => Route$20
	}),
	StoryIdRoute: Route$1.update({
		id: "/story/$id",
		path: "/story/$id",
		getParentRoute: () => Route$20
	}),
	WorldIdRoute: Route.update({
		id: "/world/$id",
		path: "/world/$id",
		getParentRoute: () => Route$20
	})
};
var routeTree = Route$20._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$3 as a, Route$6 as c, cn as d, Route$2 as i, Route$15 as l, Route as n, Route$4 as o, Route$1 as r, Route$5 as s, router_exports as t, KINDS as u };
