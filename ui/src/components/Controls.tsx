import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ControlsProps {
    playing: boolean;
    muted: boolean;
    onTogglePlay: () => void;
    onToggleMute: () => void;
}

const Controls: React.FC<ControlsProps> = ({ playing, muted, onTogglePlay, onToggleMute }) => {
    return (
        <div className="player-controls">
            <button className="control-btn glass" onClick={onTogglePlay} aria-label="Toggle play">
                {playing ? <Pause size={18} /> : <Play size={18} className="play-icon-offset" />}
            </button>
            <button className="control-btn glass" onClick={onToggleMute} aria-label="Toggle mute">
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
        </div>
    );
};

export default Controls;
