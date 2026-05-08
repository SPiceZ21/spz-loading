import React from 'react';
import { motion } from 'framer-motion';

const Branding: React.FC = () => {
    const config = window.LoadscreenConfig?.branding || {};

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="branding-wrapper"
        >
            <div className="logo-section">
                <img
                    src="./Logo/long_spz_transparent.png"
                    alt="Logo"
                    className="branding-logo"
                />
                <div className="logo-glow" />
            </div>

            <div className="branding-divider" />

            <div className="branding-text">
                <motion.h1
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="branding-title font-accent"
                >
                    {config.serverName || 'SPiceZ RACE CORE'}
                </motion.h1>
                <motion.span 
                    initial={{ opacity: 0, letterSpacing: '1em' }}
                    animate={{ opacity: 1, letterSpacing: '0.4em' }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="branding-tagline"
                >
                    {config.tagline || 'PREMIUM RACING EXPERIENCE'}
                </motion.span>
            </div>
        </motion.div>
    );
};

export default Branding;
