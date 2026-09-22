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
| `ui/src/theme.ts` | Applies the server.cfg theme as CSS variables |
| `ui/public/config.js` | Runtime config — edit without rebuilding |

## Theme

The screen paints in the server's colours, from the same `spz_theme_*` convars every other
SPiceZ UI reads — one server.cfg block re-skins the loading screen along with the rest.

```cfg
setr spz_theme_accent  "#ff6200"
setr spz_theme_accent2 "#ff9142"
setr spz_theme_bg      "#060608"
setr spz_theme_bg2     "#0a0b0f"
```

`setr`, not `set`. Every other UI gets the theme from spz-core's `SPZ:theme` push, which is
no use here: it is sent at `playerConnected`, while this client still has no scripts running
to receive it, and the screen has been painted for seconds by the time a later push lands.
Replicated convars are already on the client when `client/main.lua` runs its first line, so
it reads them with `GetConvar` and posts them into the frame directly.

Hex only — `#rrggbb` or `#rgb`, with or without the `#`. A convar that is unset or
malformed is skipped rather than substituted, so that colour keeps the value compiled into
`ui/src/index.css`; `ui/public/config.js` holds the same values for the browser preview.
Changing a colour needs no rebuild, but it does need a reconnect: a loading screen is only
read once, so `/spz reloadtheme` (which re-skins every live UI) cannot reach it.

## Build

```bash
cd ui && npm install && npm run build   # → ui/dist/index.html
```

## Dependencies

None.

---

Part of [SPiceZ-Core](../README.md) · GPL-3.0
