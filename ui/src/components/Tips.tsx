import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TipsProps {
    small?: boolean;
}

const Tips: React.FC<TipsProps> = ({ small }) => {
    const config = window.LoadscreenConfig?.tips || { items: [], interval: 5000 };
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!config.items.length) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % config.items.length);
        }, config.interval || 5000);

        return () => clearInterval(interval);
    }, [config.items.length, config.interval]);

    if (!config.items.length) return null;

    const currentTip = config.items[index];

    if (small) {
        return (
            <div className="tips-small">
                <div className="tips-header-small">
                    Tips [{index + 1}/{config.items.length}]
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="tip-description-small"
                    >
                        {currentTip.description}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="tips-container">
            <div className="tips-header">
                <span>Tips</span>
                <span>[{index + 1}/{config.items.length}]</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="tip-card"
                >
                    <div className="tip-content">
                        <span className="tip-title">
                            {currentTip.title}
                        </span>
                        <p className="tip-description">
                            {currentTip.description}
                        </p>
                    </div>

                    {/* Decorative bar */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: config.interval / 1000, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'var(--spz-orange)',
                            transformOrigin: 'left',
                            opacity: 0.5
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Tips;
