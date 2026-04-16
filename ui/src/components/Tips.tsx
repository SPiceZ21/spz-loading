import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tips: React.FC = () => {
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

    return (
        <div className="tips-container">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
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
                </motion.div>
            </AnimatePresence>
            
            {/* Pagination dots */}
            <div className="tips-pagination">
                {config.items.map((_: any, i: number) => (
                    <div 
                        key={i} 
                        className={`pagination-dot ${i === index ? 'active' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Tips;
