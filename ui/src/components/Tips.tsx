import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TipsProps {
    small?: boolean;
}

// Tip carousel. Auto-advances every `interval`; dots and arrows are clickable
// (the loadscreen has a cursor). Manual navigation resets the timer.
const Tips: React.FC<TipsProps> = ({ small }) => {
    const config = window.LoadscreenConfig?.tips || { items: [], interval: 5000 };
    const total = config.items.length;
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!total) return;
        const t = setTimeout(() => {
            setIndex((prev) => (prev + 1) % total);
        }, config.interval || 5000);
        return () => clearTimeout(t);
    }, [index, total, config.interval]);

    if (!total) return null;

    const currentTip = config.items[index];
    const next = () => setIndex((index + 1) % total);
    const prev = () => setIndex((index - 1 + total) % total);

    if (small) {
        return (
            <div className="tips-small">
                <span className="tips-tag-small">TIP {index + 1}/{total}</span>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="tip-description-small"
                    >
                        {currentTip.description}
                    </motion.span>
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="tips-container">
            <div className="tip-card">
                {/* timer rail along the top, restarts each tip */}
                <motion.div
                    key={`bar-${index}`}
                    className="tip-timer"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: (config.interval || 5000) / 1000, ease: 'linear' }}
                />

                <div className="tip-head">
                    <span className="tip-tag">TIP {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
                    <div className="tip-nav">
                        <button className="tip-arrow" onClick={prev} aria-label="Previous tip">‹</button>
                        <div className="tip-dots">
                            {config.items.map((_: unknown, i: number) => (
                                <button
                                    key={i}
                                    className={`tip-dot ${i === index ? 'active' : ''}`}
                                    onClick={() => setIndex(i)}
                                    aria-label={`Tip ${i + 1}`}
                                />
                            ))}
                        </div>
                        <button className="tip-arrow" onClick={next} aria-label="Next tip">›</button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="tip-content"
                    >
                        <span className="tip-title">{currentTip.title}</span>
                        <p className="tip-description">{currentTip.description}</p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Tips;
