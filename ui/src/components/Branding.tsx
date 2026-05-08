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


        </motion.div>
    );
};

export default Branding;
