var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import { r as renderers } from "./chunks/_@astro-renderers_CF5u9DKV.mjs";
import { c as createExports, s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_GqR6DPpv.mjs";
import { manifest } from "./manifest_CdDq4j5w.mjs";
globalThis.process ??= {};
globalThis.process.env ??= {};
var serverIslandMap = /* @__PURE__ */ new Map();
var _page0 = /* @__PURE__ */ __name(() => import("./pages/about.astro.mjs"), "_page0");
var _page1 = /* @__PURE__ */ __name(() => import("./pages/blog.astro.mjs"), "_page1");
var _page2 = /* @__PURE__ */ __name(() => import("./pages/contact.astro.mjs"), "_page2");
var _page3 = /* @__PURE__ */ __name(() => import("./pages/events.astro.mjs"), "_page3");
var _page4 = /* @__PURE__ */ __name(() => import("./pages/gallery.astro.mjs"), "_page4");
var _page5 = /* @__PURE__ */ __name(() => import("./pages/location.astro.mjs"), "_page5");
var _page6 = /* @__PURE__ */ __name(() => import("./pages/menu.astro.mjs"), "_page6");
var _page7 = /* @__PURE__ */ __name(() => import("./pages/index.astro.mjs"), "_page7");
var pageMap = /* @__PURE__ */ new Map([
  ["src/pages/about.astro", _page0],
  ["src/pages/blog/index.astro", _page1],
  ["src/pages/contact.astro", _page2],
  ["src/pages/events.astro", _page3],
  ["src/pages/gallery.astro", _page4],
  ["src/pages/location.astro", _page5],
  ["src/pages/menu.astro", _page6],
  ["src/pages/index.astro", _page7]
]);
var _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: /* @__PURE__ */ __name(() => import("./noop-entrypoint.mjs"), "actions"),
  middleware: /* @__PURE__ */ __name(() => import("./_astro-internal_middleware.mjs"), "middleware")
});
var _args = void 0;
var _exports = createExports(_manifest);
var __astrojsSsrVirtualEntry = _exports.default;
var _start = "start";
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
  serverEntrypointModule[_start](_manifest, _args);
}
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
//# sourceMappingURL=bundledWorker-0.7848819689288176.mjs.map
