import React from 'react';

const Branding: React.FC = () => {
    const config = window.LoadscreenConfig?.branding || {};

    return (
        <div className="branding-container">
            <div className="branding-wrapper">
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
                    <h1 className="branding-title font-display">
                        {config.serverName || 'SPiceZ RACE CORE'}
                    </h1>
                    <span className="branding-tagline">
                        {config.tagline || 'PREMIUM RACING EXPERIENCE'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Branding;
