# Motion Showcase: install and offline use

The Motion Showcase is a self-contained HTML page. Its animations, styles, and JavaScript are inline; its story map contains outbound reference links, but it does not need those sites or an AI/API service to run the local interactions.

## Open it

Visit the deployed Catholic Companion site and open **Motion Showcase** from the homepage, or open the `motion-showcase/` page directly. The Progressive Web App features require a secure HTTPS origin (such as GitHub Pages); opening the HTML as a local `file://` URL does not enable service workers.

## Install on Android

1. Open the deployed Motion Showcase in Chrome while online.
2. Let the page finish loading and keep the tab open briefly so the service worker can save the page and its local app files.
3. Open Chrome's menu (⋮) and choose **Install app** or **Add to Home screen** if offered. The wording varies by Chrome version and device.
4. Launch **Motion Showcase** from the home screen.

Installation prompts depend on the browser/device and its current PWA criteria. If no install option appears, use the browser menu or continue using the page in Chrome.

## Use offline

The first successful online visit is required. The service worker caches the large standalone HTML page separately from the small manifest and SVG icon, then serves the saved page if a later navigation fails offline. If the page has not yet been cached, a clear offline message explains how to recover. Reconnect, open the page again, and allow it to finish loading before disconnecting.

All core visuals and interactions are local. Links to Bible passages, museum collections, and Vatican pages are external references and need an internet connection. Browser storage can be cleared by the operating system or browser, in which case the page must be opened online again.

## Updating

The service worker checks for a newer worker when the page is revisited. New versions activate promptly and remove only older caches whose names begin with `cc-motion-showcase-`; unrelated Catholic Companion pages and caches are not managed by this worker. The page uses network-first navigation, so online visits get current HTML and refresh the offline copy. When changing the service worker's caching behavior, increment `CACHE_NAME` in `sw.js`.

## Files

- `index.html` — original showcase plus PWA manifest link and service-worker registration.
- `manifest.webmanifest` — standalone app metadata and icon declaration.
- `sw.js` — scoped, versioned offline cache and navigation fallback.
- `icons/motion-showcase.svg` — local scalable app icon.
