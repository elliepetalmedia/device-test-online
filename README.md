# Device Test Online

Browser-based hardware diagnostics for mice, keyboards, displays, microphones, webcams, controllers, typing, and audio latency.

Live site: [https://devicetesteronline.com](https://devicetesteronline.com)

## Overview

Device Test Online is a Vite-powered React SPA. The diagnostic tools run in the browser and use local device APIs where needed, while site-level traffic measurement and advertising are handled separately through Google Analytics and Google AdSense.

The current public route surface includes:

- `/`
- `/mouse-test`
- `/keyboard-test`
- `/dead-pixel-test`
- `/microphone-test`
- `/webcam-test`
- `/gamepad-test`
- `/typing-test`
- `/audio-sync-test`
- `/speaker-test`
- `/headphone-test`
- `/double-click-test`
- `/refresh-rate-test`
- `/touchscreen-test`
- `/faq`
- `/about`
- `/contact`
- `/privacy`
- `/fix-microphone-not-working`
- `/fix-webcam-not-working`
- `/fix-mouse-double-clicking`
- `/fix-monitor-not-running-at-144hz`
- `/fix-headphones-only-playing-in-one-ear`

## Local development

Requirements:

- Node.js 18+
- npm

Commands:

```bash
npm install
npm run dev
```

Additional checks:

```bash
npm run check
npm run build
npm run verify:site
```

`npm run start` previews the production build locally.

## Architecture

- Frontend app: `client/src`
- Static assets and crawl files: `client/public`
- Route metadata, route content, and JSON-LD helpers: `client/src/lib/site.ts`
- Manual verification checklist: `docs/manual-verification.md`

The app uses route-driven pages with lazy-loaded diagnostics. Shared metadata, related-test links, trust callouts, and structured data are derived from the route configuration instead of being scattered through page components.

## Privacy and disclosure

- Core diagnostics are designed to process device interactions locally in the browser.
- Microphone and webcam tests do not upload raw recordings or previews as part of the diagnostic flow.
- The site currently loads Google Analytics and may load Google AdSense, so the project does not claim zero third-party tracking at the site level.
- Public-facing trust and privacy copy should stay aligned with `client/index.html`, `client/src/lib/site.ts`, and the public info pages.

## Validation

Automated validation:

- `npm run check`
- `npm run build`
- `npm run verify:site`

Manual validation steps are documented in [docs/manual-verification.md](docs/manual-verification.md).
