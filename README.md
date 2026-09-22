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
| `server/main.lua` | Answers the client's request for the theme |
| `ui/public/config.js` | Runtime config — edit without rebuilding |

## Theme

The screen paints in the server's colours, from the same `spz_theme_*` convars every other
SPiceZ UI reads — one server.cfg block re-skins the loading screen along with the rest.

```cfg
set spz_theme_accent  "#ff6200"
set spz_theme_accent2 "#ff9142"
set spz_theme_bg      "#060608"
set spz_theme_bg2     "#0a0b0f"
```

Getting them here is awkward, because the screen is painted before the usual route exists:
spz-core pushes `SPZ:theme` at `playerConnected`, which lands while the client still has no
scripts running to receive it. So `client/main.lua` asks from two directions and takes
whichever answers first:

| Route | When it works | Cost |
|---|---|---|
| `GetConvar` on the client | Only if the convars are `setr` (replicated) | Instant, no round trip |
| `spz-loading:requestTheme` → `server/main.lua` | Either `set` or `setr` | One round trip, retried until answered |

**`set` is enough.** The server route exists so that theming the loading screen does not
require migrating a working server.cfg to `setr`. Using `setr` just skips the round trip.
The server answers from spz-core's live theme, so `/spz reloadtheme` changes are picked up
by the next player to connect.

The client prints `[spz-loading] Theme from <route>` once on success, and a warning naming
what to check if nothing answered — both visible in F8 after joining.

Hex only — `#rrggbb` or `#rgb`, with or without the `#`. A convar that is unset or
malformed is skipped rather than substituted, so that colour keeps the value compiled into
`ui/src/index.css`; `ui/public/config.js` holds the same values for the browser preview.
Changing a colour needs no rebuild, but it does need a reconnect: a loading screen is read
once, so a live re-skin cannot reach it.

## Build

```bash
cd ui && npm install && npm run build   # → ui/dist/index.html
```

## Dependencies

None.

---

Part of [SPiceZ-Core](../README.md) · GPL-3.0
