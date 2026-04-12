import { useState, useEffect } from 'react';

export interface FiveMData {
  progress: number;
  logLine: string;
}

export const useFiveM = () => {
  const [data, setData] = useState<FiveMData>({
    progress: 0,
    logLine: 'INITIALIZING...',
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { eventName, loadFraction, message } = event.data;

      if (eventName === 'loadProgress') {
        setData((prev) => ({ ...prev, progress: loadFraction * 100 }));
      } else if (eventName === 'onLogLine') {
        setData((prev) => ({ ...prev, logLine: message }));
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
