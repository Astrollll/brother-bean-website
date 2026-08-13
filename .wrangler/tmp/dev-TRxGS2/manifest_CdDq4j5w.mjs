globalThis.process ??= {}; globalThis.process.env ??= {};
import { q as decodeKey } from './chunks/astro/server_JsHXdAPb.mjs';
import './chunks/astro-designed-error-pages_wqqBrEHf.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware__P5iH3_Y.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/Projects/brother-bean-website/","cacheDir":"file:///D:/Projects/brother-bean-website/node_modules/.astro/","outDir":"file:///D:/Projects/brother-bean-website/dist/","srcDir":"file:///D:/Projects/brother-bean-website/src/","publicDir":"file:///D:/Projects/brother-bean-website/public/","buildClientDir":"file:///D:/Projects/brother-bean-website/dist/","buildServerDir":"file:///D:/Projects/brother-bean-website/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.DWzGBcaH.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.DWzGBcaH.css"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.DWzGBcaH.css"}],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"events/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.DWzGBcaH.css"}],"routeData":{"route":"/events","isIndex":false,"type":"page","pattern":"^\\/events\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/events.astro","pathname":"/events","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"gallery/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.DWzGBcaH.css"}],"routeData":{"route":"/gallery","isIndex":false,"type":"page","pattern":"^\\/gallery\\/?$","segments":[[{"content":"gallery","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/gallery.astro","pathname":"/gallery","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"location/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.DWzGBcaH.css"}],"routeData":{"route":"/location","isIndex":false,"type":"page","pattern":"^\\/location\\/?$","segments":[[{"content":"location","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/location.astro","pathname":"/location","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"menu/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.DWzGBcaH.css"}],"routeData":{"route":"/menu","isIndex":false,"type":"page","pattern":"^\\/menu\\/?$","segments":[[{"content":"menu","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/menu.astro","pathname":"/menu","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.DWzGBcaH.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://brother-bean-website.pages.dev","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["D:/Projects/brother-bean-website/src/pages/menu.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/menu@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["D:/Projects/brother-bean-website/src/pages/about.astro",{"propagation":"none","containsHead":true}],["D:/Projects/brother-bean-website/src/pages/blog/index.astro",{"propagation":"none","containsHead":true}],["D:/Projects/brother-bean-website/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["D:/Projects/brother-bean-website/src/pages/events.astro",{"propagation":"none","containsHead":true}],["D:/Projects/brother-bean-website/src/pages/gallery.astro",{"propagation":"none","containsHead":true}],["D:/Projects/brother-bean-website/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/Projects/brother-bean-website/src/pages/location.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/events@_@astro":"pages/events.astro.mjs","\u0000@astro-page:src/pages/gallery@_@astro":"pages/gallery.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/location@_@astro":"pages/location.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/menu@_@astro":"pages/menu.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CdDq4j5w.mjs","D:\\Projects\\brother-bean-website\\.astro\\content-assets.mjs":"chunks/content-assets_XqCgPAV2.mjs","D:\\Projects\\brother-bean-website\\.astro\\content-modules.mjs":"chunks/content-modules_Bvq7llv8.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_IKlo3TbA.mjs","D:/Projects/brother-bean-website/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","D:/Projects/brother-bean-website/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CZi_yXeW.mjs","D:/Projects/brother-bean-website/src/components/react/AnnouncementBar":"_astro/AnnouncementBar.BvjyDLPE.js","D:/Projects/brother-bean-website/src/components/react/BlogApp":"_astro/BlogApp.BjuMKLkU.js","D:/Projects/brother-bean-website/src/components/react/EventsSection":"_astro/EventsSection.B0zWuA5u.js","D:/Projects/brother-bean-website/src/components/react/GallerySection":"_astro/GallerySection.Dl6utvmM.js","D:/Projects/brother-bean-website/src/components/react/MenuSection":"_astro/MenuSection.CxoPQnPL.js","@astrojs/react/client.js":"_astro/client.D-vOLFpS.js","D:/Projects/brother-bean-website/src/components/ContactForm.astro?astro&type=script&index=0&lang.ts":"_astro/ContactForm.astro_astro_type_script_index_0_lang.DGB58OzU.js","D:/Projects/brother-bean-website/src/components/ContactForm.astro?astro&type=script&index=1&lang.ts":"_astro/ContactForm.astro_astro_type_script_index_1_lang.BUC5FO5j.js","D:/Projects/brother-bean-website/src/components/Footer.astro?astro&type=script&index=0&lang.ts":"_astro/Footer.astro_astro_type_script_index_0_lang.6AZtzyqr.js","D:/Projects/brother-bean-website/src/components/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.BWA5DCX3.js","D:/Projects/brother-bean-website/src/components/Hero.astro?astro&type=script&index=0&lang.ts":"_astro/Hero.astro_astro_type_script_index_0_lang.Ni43oKwN.js","D:/Projects/brother-bean-website/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.DUdTrUdO.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["D:/Projects/brother-bean-website/src/components/ContactForm.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"click\",function(e){if(e.target.id===\"fs-close-btn\"||e.target.id===\"fs-success-overlay\"){const s=document.getElementById(\"fs-success-overlay\");s.classList.add(\"opacity-0\",\"pointer-events-none\"),s.querySelector(\"div:first-child\").classList.add(\"scale-95\")}});"],["D:/Projects/brother-bean-website/src/components/ContactForm.astro?astro&type=script&index=1&lang.ts","window.formspree=window.formspree||function(){(formspree.q=formspree.q||[]).push(arguments)};formspree(\"initForm\",{formElement:\"#contact-form\",formId:\"mjgnzlpe\",onSuccess:function(){document.getElementById(\"contact-form\").reset(),document.getElementById(\"fs-success-overlay\").classList.remove(\"opacity-0\",\"pointer-events-none\"),document.getElementById(\"fs-success-overlay\").querySelector(\"div:first-child\").classList.remove(\"scale-95\")},onError:function(){alert(\"Something went wrong. Please try again.\")}});"],["D:/Projects/brother-bean-website/src/components/Footer.astro?astro&type=script&index=0&lang.ts","window.formspree=window.formspree||function(){(formspree.q=formspree.q||[]).push(arguments)};formspree(\"initForm\",{formElement:\"#newsletter-form\",formId:\"mjgnzlpe\",onSuccess:function(){document.getElementById(\"newsletter-form\").reset(),document.getElementById(\"newsletter-success-overlay\").classList.remove(\"opacity-0\",\"pointer-events-none\"),document.getElementById(\"newsletter-success-overlay\").querySelector(\"div:first-child\").classList.remove(\"scale-95\")},onError:function(){alert(\"Something went wrong. Please try again.\")}});document.addEventListener(\"click\",function(e){if(e.target.id===\"newsletter-close-btn\"||e.target.id===\"newsletter-success-overlay\"){const t=document.getElementById(\"newsletter-success-overlay\");t.classList.add(\"opacity-0\",\"pointer-events-none\"),t.querySelector(\"div:first-child\").classList.add(\"scale-95\")}});"],["D:/Projects/brother-bean-website/src/components/Header.astro?astro&type=script&index=0&lang.ts","const s=document.getElementById(\"menu-btn\"),e=document.getElementById(\"mobile-menu\"),t=document.getElementById(\"menu-icon-open\"),d=document.getElementById(\"menu-icon-close\");s.addEventListener(\"click\",()=>{const n=!e.classList.contains(\"hidden\");e.classList.toggle(\"hidden\"),t.classList.toggle(\"hidden\"),d.classList.toggle(\"hidden\"),document.body.style.overflow=n?\"\":\"hidden\"});e.querySelectorAll(\"a\").forEach(n=>{n.addEventListener(\"click\",()=>{e.classList.add(\"hidden\"),t.classList.remove(\"hidden\"),d.classList.add(\"hidden\"),document.body.style.overflow=\"\"})});"],["D:/Projects/brother-bean-website/src/components/Hero.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"hero\");e&&e.addEventListener(\"mousemove\",n=>{const t=e.getBoundingClientRect(),c=(n.clientX-t.left)/t.width,i=(n.clientY-t.top)/t.height,o=document.getElementById(\"heroGlowContainer\");o&&(o.style.transform=`translate(${(c-.5)*20}px, ${(i-.5)*20}px)`)});"]],"assets":["/_astro/about.DWzGBcaH.css","/brother-bean-logo.jpg","/favicon.png","/googlea60b18e4248e1269.html","/_headers","/_astro/AnnouncementBar.BvjyDLPE.js","/_astro/BaseLayout.astro_astro_type_script_index_0_lang.DUdTrUdO.js","/_astro/BlogApp.BjuMKLkU.js","/_astro/client.D-vOLFpS.js","/_astro/defaults.BZMwi9n3.js","/_astro/EventsSection.B0zWuA5u.js","/_astro/GallerySection.Dl6utvmM.js","/_astro/index.D-Pb_x6I.js","/_astro/MenuSection.CxoPQnPL.js","/_astro/supabase.DcjRsOeb.js","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/gallery/gallery-01-cozy-interior.jpg","/gallery/gallery-02-latte-art.jpg","/gallery/gallery-03-pastries.jpg","/gallery/gallery-04-brewing.jpg","/gallery/gallery-05-friends.jpg","/gallery/gallery-06-outdoor.jpg","/_worker.js/chunks/astro-designed-error-pages_wqqBrEHf.mjs","/_worker.js/chunks/astro_CKMQqYO2.mjs","/_worker.js/chunks/BaseLayout_BgqexsDO.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/content-assets_XqCgPAV2.mjs","/_worker.js/chunks/content-modules_Bvq7llv8.mjs","/_worker.js/chunks/defaults_ulNjGZ4Z.mjs","/_worker.js/chunks/menu_1FOmCfcB.mjs","/_worker.js/chunks/noop-middleware__P5iH3_Y.mjs","/_worker.js/chunks/parse_CivD-hpl.mjs","/_worker.js/chunks/path_BgNISshD.mjs","/_worker.js/chunks/remote_CVXTZJrr.mjs","/_worker.js/chunks/render-context_BxCGWXBx.mjs","/_worker.js/chunks/sharp_CZi_yXeW.mjs","/_worker.js/chunks/_@astro-renderers_CF5u9DKV.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_GqR6DPpv.mjs","/_worker.js/chunks/_astro_assets_7hQ78gC0.mjs","/_worker.js/chunks/_astro_data-layer-content_IKlo3TbA.mjs","/_worker.js/_astro/about.DWzGBcaH.css","/_worker.js/pages/about.astro.mjs","/_worker.js/pages/blog.astro.mjs","/_worker.js/pages/contact.astro.mjs","/_worker.js/pages/events.astro.mjs","/_worker.js/pages/gallery.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/pages/location.astro.mjs","/_worker.js/pages/menu.astro.mjs","/_worker.js/chunks/astro/server_JsHXdAPb.mjs","/about/index.html","/blog/index.html","/contact/index.html","/events/index.html","/gallery/index.html","/location/index.html","/menu/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"2PQA1T1QSe8nc2x5anM4+Bo+zDKqRqZfvXRiJLjGgyI=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
