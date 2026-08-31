import { useState, useEffect } from 'react';

export interface FiveMData {
  progress: number;
  logLine: string;
}

/*
 * The loading screen shows TWO phases, and they are driven by different senders.
 *
 * Phase 1 is the engine: `loadProgress` / `onLogLine` while resources stream,
 * 0 → 100%. That is where this hook used to stop — and because the screen is
 * manual-shutdown, the player then sat looking at a full bar for as long as the
 * server handshake took, with no way to tell waiting from hanging.
 *
 * Phase 2 is ours: `spzStage`, sent by spz-loading once the client is running
 * and we are waiting on the server for a profile and on the world to stream.
 *
 * The bar is rescaled rather than restarted. Phase 1 fills the first 60%, phase
 * 2 the last 40%, so it only ever moves forward — a bar that hits 100% and then
 * jumps back to 30% reads as an error even when nothing is wrong.
 */
const ENGINE_SHARE = 0.6;

export const useFiveM = () => {
  const [data, setData] = useState<FiveMData>({
    progress: 0,
    logLine: 'INITIALIZING...',
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { eventName, loadFraction, message } = event.data ?? {};

      if (eventName === 'loadProgress') {
        const pct = loadFraction * 100 * ENGINE_SHARE;
        // Never walk backwards: the engine re-emits progress in bursts, and a
        // stage message may already have taken us past this point.
        setData((prev) => ({ ...prev, progress: Math.max(prev.progress, pct) }));
      } else if (eventName === 'onLogLine') {
        setData((prev) => ({ ...prev, logLine: message }));
      } else if (eventName === 'spzStage') {
        const pct = (ENGINE_SHARE + loadFraction * (1 - ENGINE_SHARE)) * 100;
        setData((prev) => ({
          progress: Math.max(prev.progress, pct),
          logLine: message ?? prev.logLine,
        }));
      }
    };

    window.addEventListener('message', handleMessage);

    // For development testing
    if (import.meta.env.DEV) {
        const interval = setInterval(() => {
            setData(prev => {
                if (prev.progress >= 100) {
                    clearInterval(interval);
                    return prev;
                }
                return {
                    progress: prev.progress + 1,
                    logLine: `LOADING ${prev.progress}%...`
                }
            });
        }, 500);
        return () => clearInterval(interval);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return data;
};
