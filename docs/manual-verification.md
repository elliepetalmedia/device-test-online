# Manual Verification Checklist

Use this checklist after significant content, routing, or diagnostic changes.

## Public routes

Verify these routes load without layout or navigation regressions:

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

## Metadata and structured data

For `/`, `/microphone-test`, `/speaker-test`, `/faq`, and one troubleshooting guide such as `/fix-microphone-not-working`:

- Confirm the page title and meta description match the visible page content.
- Confirm the canonical URL matches the current route.
- Confirm the JSON-LD script updates to the expected page type.
- Confirm related-diagnostic cards and CTA links point to live routes.

## Diagnostic flows

Verify the main user flows still work:

- Mouse: clicks, scroll log, polling-rate graph, double-click warning.
- Double click: repeated click sampling, suspicious-burst detection, reset.
- Keyboard: key visualization and rollover behavior.
- Monitor: color cycle, fullscreen behavior, stuck-pixel fixer warning modal.
- Refresh rate: live Hz measurement, peak reset, explanatory copy.
- Touchscreen: touch pad tracking, multi-touch count, no-touch fallback messaging.
- Microphone: permission prompt, record, playback, speaker test, reset.
- Speaker/headphone: left-right-center playback, blocked-audio messaging, checklist export.
- Webcam: permission prompt, preview start, stop, stream stats.
- Gamepad: controller detection, drift sequence, vibration attempt.
- Typing: start, live scoring, reset.
- Audio sync: start sequence, false start, reaction capture, reset.

## Session and shell behavior

- Open the Test Summary / Export modal and confirm results reflect the current session.
- Confirm the downloadable hardware report and call-setup checklist exports generate text files successfully.
- Confirm mobile navigation opens, closes, and route changes remain usable on narrow viewports.
- Confirm footer and privacy/trust text align with the presence of Google Analytics and Google AdSense scripts.
