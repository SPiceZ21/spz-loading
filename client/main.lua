-- spz-loading/client/main.lua
--
-- Owns the loading screen's lifetime.
--
-- The manifest sets `loadscreen_manual_shutdown 'yes'`, which means the game
-- will NEVER take the screen down on its own — some script has to call
-- ShutdownLoadingScreen. That responsibility used to live in spz-spawn, buried
-- inside two event handlers. If either handler errored before reaching it (and
-- one of them reliably did), the screen stayed up forever with the engine's
-- progress bar pinned at 100%: the player sat looking at a finished bar with
-- nothing behind it. Every "stuck on loading" report was that.
--
-- The screen is a shared surface, so it gets a single owner with one way in and
-- one way out:
--
--   exports['spz-loading']:Stage(key, label)   -- report boot progress
--   exports['spz-loading']:Finish()            -- take it down (idempotent)
--
-- Two phases are shown to the player. The engine drives the first (resource
-- streaming, `loadProgress`, 0→100%). This file drives the second: the part
-- AFTER the game has loaded, where we are still waiting on the server for a
-- profile and on the world to stream in. Before, that second phase had no
-- signal at all, which is why a stall there was indistinguishable from a crash.

local STAGES = {
    booting  = { fraction = 0.10, label = 'STARTING CLIENT' },
    connect  = { fraction = 0.30, label = 'CONTACTING SERVER' },
    profile  = { fraction = 0.55, label = 'LOADING DRIVER PROFILE' },
    world    = { fraction = 0.80, label = 'STREAMING WORLD' },
    ready    = { fraction = 1.00, label = 'READY' },
}

local finished  = false
local lastStage = 'booting'
local stagedAt  = GetGameTimer()

-- Post to the loading screen's frame. Only meaningful while it is still up;
-- after Finish() the frame is gone and the native is a no-op.
local function Post(payload)
    if finished then return end
    pcall(SendLoadingScreenMessage, json.encode(payload))
end

--- Report where boot has got to. Drives the second-phase progress bar.
--- @param key string one of STAGES
--- @param label string? overrides the default label (e.g. a retry count)
local function Stage(key, label)
    local stage = STAGES[key]
    if not stage or finished then return end

    lastStage = key
    stagedAt  = GetGameTimer()

    Post({
        eventName    = 'spzStage',
        stage        = key,
        loadFraction = stage.fraction,
        message      = label or stage.label,
    })
end

--- Take the loading screen down. Safe to call from anywhere, any number of
--- times — the first call wins.
local function Finish()
    if finished then return end
    finished = true

    ShutdownLoadingScreen()
    ShutdownLoadingScreenNui()
end

exports('Stage', Stage)
exports('Finish', Finish)
exports('IsFinished', function() return finished end)

-- ── Watchdog ──────────────────────────────────────────────────────────────────
--
-- The old failsafe was a blind 20s timer that killed the screen and said
-- nothing, dropping the player into an unstreamed black world with no menu and
-- no explanation. This one reports WHICH stage stalled, which is the difference
-- between a bug report and a guess.
--
-- It still takes the screen down at the end — sitting on a frozen loading
-- screen is worse than being in the world with an error on screen — but it
-- leaves a trail first.

local WATCHDOG_MS = 45000
local STALL_MS    = 20000

CreateThread(function()
    local startedAt = GetGameTimer()

    while not finished do
        Wait(1000)

        local now = GetGameTimer()

        if not finished and now - stagedAt > STALL_MS then
            print(('^3[spz-loading] Boot stalled at stage "%s" for %.0fs^7')
                :format(lastStage, (now - stagedAt) / 1000))
            stagedAt = now  -- report once per stall window, not once a second
        end

        if now - startedAt > WATCHDOG_MS then
            print(('^1[spz-loading] Boot never completed (last stage: %s) — forcing the loading screen down after %ds^7')
                :format(lastStage, WATCHDOG_MS / 1000))
            Finish()
            return
        end
    end
end)

Stage('booting')
