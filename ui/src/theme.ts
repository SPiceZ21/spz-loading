/*
 * theme.ts — the loading screen's colours come from server.cfg, not this bundle.
 *
 * `setr spz_theme_accent "#ff6200"` (and friends) makes the theme convars
 * REPLICATED, which is the whole trick: spz-loading/client/main.lua can read
 * them with GetConvar the instant client scripts start and post them straight
 * here. The usual route every other SPiceZ UI takes — the server pushing
 * `SPZ:theme` at playerConnected — is no good to a loading screen, because that
 * push happens while the client still has no scripts running to receive it. By
 * the time the theme would arrive the screen has already been painted orange.
 *
 * Whatever is compiled into index.css stays as the fallback, so a server that
 * sets no theme convars looks exactly as it did before.
 */

export interface SpzTheme {
  accent?: string;
  accent2?: string;
  bg?: string;
  bg2?: string;
  danger?: string;
  gold?: string;
}

/** theme key → the CSS custom property it drives. */
const VARS: Record<keyof SpzTheme, string> = {
  accent: '--spz-orange',
  accent2: '--spz-accent2',
  bg: '--spz-bg',
  bg2: '--spz-bg2',
  danger: '--spz-danger',
  gold: '--spz-gold',
};

/**
 * Keys that also feed an "R, G, B" triplet, for the rgba() slots in index.css
 * that need an alpha off the same colour (the accent glow, the surface panels).
 */
const RGB_VARS: Partial<Record<keyof SpzTheme, string>> = {
  accent: '--spz-orange-rgb',
  bg2: '--spz-bg2-rgb',
};

const HEX6 = /^#?([0-9a-f]{6})$/i;
const HEX3 = /^#?([0-9a-f]{3})$/i;

/**
 * Accepts `#ff6200`, `ff6200` and the 3-digit shorthand, and returns a
 * normalised `#rrggbb`. Anything else returns null and is skipped — a typo in
 * server.cfg should leave that one colour at its default, not blank the screen.
 */
function normalizeHex(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim();

  const six = HEX6.exec(v);
  if (six) return `#${six[1].toLowerCase()}`;

  const three = HEX3.exec(v);
  if (three) {
    const [r, g, b] = three[1].toLowerCase();
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return null;
}

/** `#ff6200` → `255, 98, 0`. Expects an already-normalised hex. */
function rgbTriplet(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export function applyTheme(theme: SpzTheme | null | undefined): void {
  if (!theme) return;
  const root = document.documentElement.style;

  for (const key of Object.keys(VARS) as (keyof SpzTheme)[]) {
    const hex = normalizeHex(theme[key]);
    if (!hex) continue;

    root.setProperty(VARS[key], hex);

    const rgbVar = RGB_VARS[key];
    if (rgbVar) root.setProperty(rgbVar, rgbTriplet(hex));
  }
}

/**
 * Start listening. Called once from main.tsx, before React mounts, so the first
 * painted frame already carries the server's colours when the message beat us
 * to it.
 */
export function initTheme(): void {
  window.addEventListener('message', (event: MessageEvent) => {
    // SendLoadingScreenMessage delivers the decoded object, but tolerate the
    // raw JSON string too: it costs three lines, and the alternative failure is
    // a screen that silently ignores every theme it is sent.
    let data = event.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return;
      }
    }
    if (data?.eventName === 'spzTheme') applyTheme(data.theme as SpzTheme);
  });

  // No server behind us (`npm run dev`, or a server with spz-loading's client
  // script missing): fall back to config.js so the preview is still brandable.
  const branding = window.LoadscreenConfig?.branding;
  if (branding) {
    applyTheme({
      accent: branding.accentColor,
      accent2: branding.accent2Color,
      bg: branding.bgColor,
      bg2: branding.bg2Color,
    });
  }
}
