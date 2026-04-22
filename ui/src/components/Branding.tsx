import React from 'react';
import { motion } from 'framer-motion';

const Branding: React.FC = () => {
    const config = window.LoadscreenConfig?.branding || {};
    
    return (
        <div className="branding-container">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
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
                    <h1 className="branding-title" style={{ fontFamily: 'Panchang' }}>
                        {config.serverName || 'SPiceZ RACE CORE'}
                    </h1>
                    <span className="branding-tagline">
                        {config.tagline || 'PREMIUM RACING EXPERIENCE'}
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default Branding;
