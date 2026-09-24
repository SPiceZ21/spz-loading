window.LoadscreenConfig = {
    // Local background videos live in ui/public/video, music in ui/public/audio
    audio: {
        muted: false,
        volume: 30,   // 0..100 default
    },

    // UI Branding (logo only — no text).
    //
    // FALLBACK ONLY. On a live server the colours come from server.cfg's
    // `setr spz_theme_*` convars, which spz-loading reads on the client and
    // posts in; they overwrite anything set here. These values are what the
    // browser preview (`npm run dev`) uses, and what a server that sets no
    // theme convars falls back to. Hex only.
    branding: {
        accentColor: '#FF6200',   // spz_theme_accent
        accent2Color: '#FF9142',  // spz_theme_accent2
        bgColor: '#07080A',       // spz_theme_bg
        bg2Color: '#0E1014',      // spz_theme_bg2

        // Logo size. The logo already scales with screen height; this multiplies
        // that. 1 = default, 1.5 = half again bigger, 0.8 = smaller (0.5 – 2.5).
        logoScale: 1,
    },

    // Auto-sliding Tips
    tips: {
        interval: 5000, // ms
        items: [
            {
                title: 'TUNE YOUR RIDE',
                description: 'Visit the Performance Shop to upgrade your engine, suspension, and brakes for a competitive edge.'
            },
            {
                title: 'DRIFT FOR POINTS',
                description: 'Hold the handbrake and counter-steer to initiate drifts. High angles and speed multiply your score!'
            },
            {
                title: 'LICENSE CLASSES',
                description: 'Complete race milestones to unlock higher license classes and gain access to faster vehicles.'
            },
            {
                title: 'STAY ON TRACK',
                description: 'Cutting corners or going off-track will result in time penalties or lap invalidation.'
            },
            {
                title: 'PRACTICE MAKES PERFECT',
                description: 'Use Time Trial mode to master racing lines and braking points on every track.'
            }
        ]
    },

    // Loading texts
    loadingMessages: [
        'INITIALIZING SYSTEMS...',
        'LOADING MAP DATA...',
        'SYNCING PLAYER STATS...',
        'TUNING ENGINES...',
        'PREPARING TRACK...',
    ],
};
