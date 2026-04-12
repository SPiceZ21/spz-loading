import React from 'react';
import { motion } from 'framer-motion';
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
            <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onTogglePlay}
                className="control-btn glass"
            >
                {playing ? <Pause size={18} /> : <Play size={18} className="play-icon-offset" />}
            </motion.div>
            
            <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleMute}
                className="control-btn glass"
            >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </motion.div>
        </div>
    );
};

export default Controls;
