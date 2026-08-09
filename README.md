# spz-loading

> Loading screen · `v1.2.1`

## Overview

`spz-loading` replaces the default loading screen with a branded one: background video
with an audio volume slider, a segmented progress bar driven by the client's load events,
and a tips carousel. It is registered as a `loadscreen` with manual shutdown, so
[spz-spawn](../spz-spawn/README.md) decides when it disappears.

## Structure

| Path | Purpose |
|---|---|
| `fxmanifest.lua` | `loadscreen` registration, manual shutdown, cursor enabled |
| `ui/src/App.tsx` | Screen composition |
| `ui/src/components/MediaBg.tsx` | Background video and audio |
| `ui/src/components/ProgressBar.tsx` | Segmented load progress |
| `ui/src/components/Tips.tsx` | Tips carousel |
| `ui/src/components/Controls.tsx` | Volume and tip navigation |
| `ui/src/components/Branding.tsx` | Logo and server name |
| `ui/src/hooks/useFiveM.ts` | Load-event bridge |
| `ui/public/config.js` | Runtime config — edit without rebuilding |

## Build

```bash
cd ui && npm install && npm run build   # → ui/dist/index.html
```

## Dependencies

None.

---

Part of [SPiceZ-Core](../README.md) · GPL-3.0
