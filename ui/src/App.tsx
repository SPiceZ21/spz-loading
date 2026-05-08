import React, { useState } from 'react';
import { useFiveM } from './hooks/useFiveM';
import YouTubeBg from './components/YouTubeBg';
import Branding from './components/Branding';
import ProgressBar from './components/ProgressBar';
import Controls from './components/Controls';

import Tips from './components/Tips';

const App: React.FC = () => {
  const { progress, logLine } = useFiveM();
  const config = window.LoadscreenConfig || {};
  
  // Player state
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(config.youtube?.muted ?? false);
  const volume = config.youtube?.volume ?? 30;

  return (
    <div className="app-container selection-accent">
      <YouTubeBg 
        play={playing}
        mute={muted}
        volume={volume}
      />
      
      {/* Cinematic Overlays */}
      <div className="scanlines" />
      <div className="crt-overlay" />
      
      {/* HUD Layer */}
      <div className="hud-layer">
        <div className="top-section">
          <Branding />
          <Controls 
            playing={playing}
            muted={muted}
            onTogglePlay={() => setPlaying(!playing)}
            onToggleMute={() => setMuted(!muted)}
          />
        </div>

        <div className="bottom-section">
          <div className="bottom-content">
             <ProgressBar progress={progress} logLine={logLine} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
