# spz-loading

> Themed loading screen with real boot progress.

![version](https://img.shields.io/badge/version-1.7.0-ff6200) ![SPiceZ-Core](https://img.shields.io/badge/SPiceZ--Core-beta-18181b)

## Overview

A minimal loading screen in the server theme. After the game loads it shows the second phase too — contacting the server, loading the profile, streaming the world — and owns taking the screen down, with a watchdog so it can never hang.

## Features

- Two-phase progress (engine load + SPZ boot stages)
- Theme from `spz_theme_*` convars
- Watchdog that reports which stage stalled
- `spz-loading:finished` event so other UIs stay hidden until it is down

## Requirements

None — runs on its own.

## Installation

Included in the [txAdmin recipe](https://github.com/SPiceZ21/spz-txrecipe). Manual install:

1. Download `spz-loading` from GitHub (latest release, or the repository) into your `resources` folder.
2. Add to `server.cfg`:

```cfg
ensure spz-loading
```

## Exports

| Export | Side |
|---|---|
| `Finish` | client |
| `IsFinished` | client |
| `Stage` | client |

```lua
exports["spz-loading"]:Finish(...)
```

---

Part of **SPiceZ-Core** — [documentation](https://github.com/SPiceZ21/Docs) · [all modules](https://github.com/SPiceZ21/Docs/blob/main/modules/README.md)
