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
      {/* Background Media */}
      {config.mediaType === 'youtube' && (
        <YouTubeBg 
          play={playing}
          mute={muted}
          volume={volume}
        />
      )}
      
      {/* HUD Layer */}
      <div className="hud-layer">
        <Branding />
        
        {/* Interactive elements must re-enable pointer events */}
        <div className="controls-wrapper">
          <Controls 
            playing={playing}
            muted={muted}
            onTogglePlay={() => setPlaying(!playing)}
            onToggleMute={() => setMuted(!muted)}
          />
        </div>

        {/* Tips Box */}
        <div className="tips-overlay">
            <Tips />
        </div>
        
        <ProgressBar progress={progress} logLine={logLine} />
      </div>

      {/* Decorative vignette */}
      <div className="vignette" />
    </div>
  );
};

export default App;
