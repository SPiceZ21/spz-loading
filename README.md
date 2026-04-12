<div align="center">

<img src="https://github.com/SPiceZ21/spz-core-media-kit/raw/main/Banner/Banner%232.png" alt="SPiceZ-Core Banner" width="100%"/>

<br/>

# spz-loading

### Modern React-based Loading Screen

*A sleek, high-performance loading screen for FiveM built with React, TypeScript, and Vite. Features dynamic tips, progress tracking, and a seamless YouTube background.*

<br/>

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-orange.svg?style=flat-square)](https://www.gnu.org/licenses/gpl-3.0)
[![FiveM](https://img.shields.io/badge/FiveM-Compatible-orange?style=flat-square)](https://fivem.net)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)]()

</div>

---

## Overview

`spz-loading` is the dedicated loading screen for the SPiceZ-Core ecosystem. Built with a modern web stack (React, TypeScript, Vite), it listens natively to FiveM's internal loading events to display an accurate progress bar, cycles through helpful gameplay tips, and immerses players immediately with a full-screen, muted YouTube video background.

---

## Features

- **React & Vite** — Lightning fast UI built with standard modern web tech
- **Live Progress Tracking** — Hooks into FiveM's `loadProgress` and data file entries to show real-time connection status
- **YouTube Background** — Streams a looping, muted YouTube video for highly engaging visuals
- **Dynamic Tips** — Cycles through configurable race tips, rules, and server information
- **Custom Branding** — Prominent logos and branding aligned with the SPiceZ ecosystem

---

## Dependencies

| Resource | Version | Role |
|---|---|---|
| FiveM | Latest | Base platform running the NUI loading screen |

*(No other specific `spz-*` dependencies required for the loading screen to function)*

---

## Installation

1. Build the UI:
   ```bash
   cd ui
   npm install
   npm run build
   ```
2. Add to your server config:
   ```cfg
   ensure spz-loading
   ```

---

## Configuration

You can modify the YouTube Video ID and loading tips within the UI components or configuration files.
- Video settings are located in `ui/src/components/YouTubeBg.tsx`
- Tips are managed in `ui/src/components/Tips.tsx`

---

## How it works

`spz-loading` utilizes FiveM's standard loading screen callbacks, exposed via the custom hook in `ui/src/hooks/useFiveM.ts`. It captures events such as:
- `startInitFunction` / `startInitFunctionOrder`
- `startDataFileEntries` / `performMapLoadFunction`
- `onLogLine`

These events are translated into the interactive progress bar that players see while joining the server.

---

<div align="center">

*Part of the [SPiceZ-Core](https://github.com/SPiceZ-Core) ecosystem*

**[Docs](https://github.com/SPiceZ-Core/spz-docs) · [Discord](https://discord.gg/) · [Issues](https://github.com/SPiceZ-Core/spz-loading/issues)**

</div>
