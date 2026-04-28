<div align="center">

<img src="https://github.com/SPiceZ21/spz-core-media-kit/raw/main/Banner/Banner%232.png" alt="SPiceZ-Core Banner" width="100%"/>

<br/>

# spz-loading
> Minimal Loading Screen · `v1.1.0`

## NUI

**Stack:** Vite · Preact · TypeScript · spz-ui

Features: YouTube background video, segmented progress bar, tips carousel.

> Note: registered as a `loadscreen` (not `ui_page`).

```
ui/
├── src/
│   ├── app.tsx
│   ├── components/       # spz-ui components
│   └── styles/
└── dist/                 # built output (served by FiveM)
    └── index.html
```

Build: `cd ui && npm run build`

## CI
Built and released via `.github/workflows/release.yml` on push to `main`.
