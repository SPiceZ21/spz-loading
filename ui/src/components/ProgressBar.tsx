import React from 'react';
import { motion } from 'framer-motion';
import Tips from './Tips';

interface ProgressBarProps {
    progress: number;
    logLine: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="progress-container">
            <div className="progress-info">
                <div className="integrated-tips">
                    <Tips small />
                </div>

                <div className="progress-percentage">
                    <span className="percentage-value">
                        {Math.round(progress)}<span className="percentage-symbol">%</span>
                    </span>
                </div>
            </div>
            
            <div className="segmented-bar">
                <motion.div 
                    className="bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
