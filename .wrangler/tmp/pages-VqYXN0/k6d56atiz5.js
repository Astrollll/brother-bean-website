// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/",
    "/_astro/*",
    "/brother-bean-logo.jpg",
    "/favicon.png",
    "/googlea60b18e4248e1269.html",
    "/gallery/gallery-01-cozy-interior.jpg",
    "/gallery/gallery-02-latte-art.jpg",
    "/gallery/gallery-03-pastries.jpg",
    "/gallery/gallery-04-brewing.jpg",
    "/gallery/gallery-05-friends.jpg",
    "/gallery/gallery-06-outdoor.jpg",
    "/about",
    "/blog",
    "/contact",
    "/events",
    "/gallery",
    "/location",
    "/menu",
    "/admin/*",
    "/_headers",
    "/_redirects"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "D:\\Projects\\brother-bean-website\\.wrangler\\tmp\\pages-VqYXN0\\bundledWorker-0.7848819689288176.mjs";
import { isRoutingRuleMatch } from "D:\\Projects\\brother-bean-website\\node_modules\\wrangler\\templates\\pages-dev-util.ts";
export * from "D:\\Projects\\brother-bean-website\\.wrangler\\tmp\\pages-VqYXN0\\bundledWorker-0.7848819689288176.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=k6d56atiz5.js.map
