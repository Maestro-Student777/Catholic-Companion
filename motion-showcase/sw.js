/* Catholic Companion · Motion Showcase
 * Versioned, same-origin-only cache. Bump CACHE_NAME when changing this worker.
 */
"use strict";

const CACHE_NAME = "cc-motion-showcase-v1";
const SHELL_ASSETS = [
  new URL("./manifest.webmanifest", self.registration.scope).href,
  new URL("./icons/motion-showcase.svg", self.registration.scope).href
];
const PAGE_URL = new URL("./", self.registration.scope);
const PAGE_FILE_URL = new URL("./index.html", self.registration.scope);
const OFFLINE_HTML = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#14110f"><title>Motion Showcase · Offline</title>
<style>body{margin:0;padding:2rem;min-height:100vh;box-sizing:border-box;background:#14110f;color:#f3ead8;font:18px/1.6 system-ui,sans-serif;display:grid;place-items:center}main{max-width:36rem}h1{color:#d9a441}a{color:#4fb3a5}</style>
<main><h1>Motion Showcase is offline</h1><p>The showcase has not been saved on this device yet, or its saved copy could not be opened.</p><p>Reconnect to the internet, open this page once, and wait for it to finish loading. Then try again offline.</p><p><a href="./">Try the showcase again</a></p></main></html>`;

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache small shell assets first. Cache the large self-contained HTML separately
    // instead of using addAll for the whole set, so a large page doesn't obscure which
    // request failed and can be cached with an explicit response check.
    await cache.addAll(SHELL_ASSETS);
    const response = await fetch(PAGE_FILE_URL.href, { cache: "reload" });
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) {
      throw new Error("Motion Showcase HTML could not be cached during installation.");
    }
    await cache.put(PAGE_FILE_URL.href, response.clone());
    await cache.put(PAGE_URL.href, response.clone());
    // Activate the new worker promptly; it replaces only this app's versioned caches.
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith("cc-motion-showcase-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);

  // Do not intercept external links, or the worker script itself: browser update checks
  // must be able to fetch the newest worker rather than a cached copy.
  if (url.origin !== scopeUrl.origin || url.pathname === new URL("./sw.js", scopeUrl).pathname) return;
  if (!url.href.startsWith(scopeUrl.href)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && response.headers.get("content-type")?.includes("text/html")) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
          if (url.pathname === PAGE_URL.pathname || url.pathname === PAGE_FILE_URL.pathname) {
            await cache.put(PAGE_URL.href, response.clone());
            await cache.put(PAGE_FILE_URL.href, response.clone());
          }
        }
        return response;
      } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(request))
          || (await cache.match(PAGE_URL.href))
          || (await cache.match(PAGE_FILE_URL.href))
          || new Response(OFFLINE_HTML, {
            headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
          });
      }
    })());
    return;
  }

  // The page has no external runtime assets. Cache same-origin GET resources as they
  // are requested, but prefer the network for fresh copies when available.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    try {
      const response = await fetch(request);
      if (response.ok && response.type !== "opaque") await cache.put(request, response.clone());
      return response;
    } catch (_) {
      return cached || Response.error();
    }
  })());
});
