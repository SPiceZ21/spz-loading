import React from 'react';
import { motion } from 'framer-motion';

// config.js `branding.logoScale` — a multiplier on the screen-relative size.
// Clamped so a typo can't blow the logo up past the screen or shrink it away.
const logoScale = (() => {
    const v = Number(window.LoadscreenConfig?.branding?.logoScale);
    return Number.isFinite(v) && v > 0 ? Math.min(Math.max(v, 0.5), 2.5) : 1;
})();

// config.js `branding.logo` — file in ui/public/Logo/ (or any URL). Swap the
// logo by dropping a new file in that folder and naming it here.
const logoSrc = (() => {
    const v = window.LoadscreenConfig?.branding?.logo;
    if (typeof v !== 'string' || !v.trim()) return './Logo/logo.png';
    return /^(https?:)?\/\/|^\.?\//.test(v) ? v : `./Logo/${v}`;
})();

const Branding: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="branding-wrapper"
            style={{ '--logo-scale': logoScale } as React.CSSProperties}
        >
            <div className="logo-section">
                <img
                    src={logoSrc}
                    alt="Logo"
                    className="branding-logo"
                />
                <div className="logo-glow" />
            </div>
        </motion.div>
    );
};

export default Branding;
