import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ControlsProps {
    playing: boolean;
    muted: boolean;
    volume: number;
    onTogglePlay: () => void;
    onToggleMute: () => void;
    onVolume: (v: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ playing, muted, volume, onTogglePlay, onToggleMute, onVolume }) => {
    const shown = muted ? 0 : volume;
    return (
        <div className="player-controls">
            <button className="control-btn glass" onClick={onTogglePlay} aria-label="Toggle play">
                {playing ? <Pause size={18} /> : <Play size={18} className="play-icon-offset" />}
            </button>
            <button className="control-btn glass" onClick={onToggleMute} aria-label="Toggle mute">
                {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="volume-slider glass">
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={shown}
                    onChange={(e) => onVolume(Number(e.target.value))}
                    style={{ ['--fill' as any]: `${shown}%` }}
                    aria-label="Volume"
                />
            </div>
        </div>
    );
};

export default Controls;
