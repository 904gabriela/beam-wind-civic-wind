import { i as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as cn } from "./router-DqXMpz5r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portrait-card-BJk47sy6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Face({ name, image, tagline, featured, className }) {
	const [broken, setBroken] = (0, import_react.useState)(false);
	const showImage = Boolean(image) && !broken;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group relative block overflow-hidden rounded-xl bg-elevated", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("overflow-hidden", featured ? "banner" : "portrait"),
				children: showImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: "",
					className: "size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]",
					onError: () => setBroken(true)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-full items-center justify-center font-display text-4xl text-muted",
					children: name.slice(0, 1)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("font-display leading-tight text-fg", featured ? "text-2xl sm:text-3xl" : "text-lg"),
					children: name
				}), tagline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("mt-1 text-muted", featured ? "line-clamp-2 text-sm" : "line-clamp-2 text-xs"),
					children: tagline
				}) : null]
			})
		]
	});
}
function PortraitCard({ name, image, tagline, featured, to, params, onClick }) {
	if (onClick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: featured ? "col-span-2 text-left" : "text-left",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
			name,
			image,
			tagline,
			featured
		})
	});
	if (!to || !params) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
		name,
		image,
		tagline,
		featured
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		params,
		className: featured ? "col-span-2" : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
			name,
			image,
			tagline,
			featured
		})
	});
}
//#endregion
export { PortraitCard as t };
