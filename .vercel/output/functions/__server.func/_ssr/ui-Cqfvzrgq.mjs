import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as cn } from "./router-DqXMpz5r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-Cqfvzrgq.js
var import_jsx_runtime = require_jsx_runtime();
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium tracking-wide text-muted",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-subtle",
				children: hint
			}) : null
		]
	});
}
function TextInput({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: cn("h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none transition-colors duration-150 placeholder:text-subtle focus:border-border-strong", className)
	});
}
function TextArea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		className: cn("min-h-28 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm leading-relaxed text-fg outline-none transition-colors duration-150 placeholder:text-subtle focus:border-border-strong", className)
	});
}
function Button({ className, variant = "primary", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...props,
		className: cn("inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-transform duration-150 enabled:active:scale-[0.98] disabled:opacity-40", variant === "primary" && "bg-fg text-bg", variant === "ghost" && "border border-border bg-transparent text-fg", variant === "quiet" && "bg-elevated text-fg", variant === "danger" && "bg-danger text-fg", className)
	});
}
function Toggle({ checked, onChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		onClick: () => onChange(!checked),
		className: "flex h-11 w-full items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-fg",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("relative h-6 w-10 rounded-full transition-colors duration-150", checked ? "bg-fg" : "bg-elevated"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-0.5 left-0.5 size-5 rounded-full transition-transform duration-150", checked ? "translate-x-4 bg-bg" : "bg-muted") })
		})]
	});
}
function Chip({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3.5 text-sm font-medium transition-colors duration-150", active ? "bg-fg text-bg" : "bg-elevated text-muted hover:text-fg"),
		children
	});
}
function Panel({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border border-border bg-surface p-4", className),
		children
	});
}
function Select({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		...props,
		className: cn("h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none transition-colors duration-150 focus:border-border-strong", className),
		children
	});
}
function EmptyState({ title, message, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl text-fg",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted",
				children: message
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap justify-center gap-2",
				children: action
			}) : null
		]
	});
}
function PageHeader({ title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-end justify-between gap-4 px-4 pt-6 pb-4 pr-36 lg:pl-8 lg:pr-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl tracking-tight text-fg",
			children: title
		}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: subtitle
		}) : null] }), action]
	});
}
//#endregion
export { PageHeader as a, TextArea as c, Field as i, TextInput as l, Chip as n, Panel as o, EmptyState as r, Select as s, Button as t, Toggle as u };
