export {};

declare global {
  interface Window {
    LoadscreenConfig: any;
    /** Injected by FiveM from server-side `deferrals.handover(...)`. */
    nuiHandoverData?: { spzTheme?: import('./theme').SpzTheme };
  }
}
