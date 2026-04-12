import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
    logLine: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, logLine }) => {
    // 50 segments for a smooth but distinct segmented look
    const segments = Array.from({ length: 50 });
    
    return (
        <div className="progress-container">
            <div className="progress-info">
                <div className="progress-status">
                    <span className="status-label">SYSTEM INITIALIZATION</span>
                    <motion.span 
                        key={logLine}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="status-text uppercase"
                    >
                        {logLine}
                    </motion.span>
                </div>
                <div className="progress-percentage">
                    <span className="percentage-value" style={{ fontFamily: 'Panchang' }}>
                        {Math.round(progress)}<span className="percentage-symbol">%</span>
                    </span>
                </div>
            </div>
            
            <div className="segmented-bar">
                {segments.map((_, i) => {
                    const threshold = (i / segments.length) * 100;
                    const isActive = progress > threshold;
                    
                    return (
                        <div 
                            key={i} 
                            className={`bar-segment ${isActive ? 'active' : ''}`}
                            style={{ 
                                transitionDelay: isActive ? `${i * 10}ms` : '0ms' 
                            }}
                        />
                    );
                })}
                {/* Glow layer */}
                <motion.div 
                    className="bar-glow"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
