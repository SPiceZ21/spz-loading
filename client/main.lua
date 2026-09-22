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

-- ── Theme ─────────────────────────────────────────────────────────────────
--
-- The screen paints in server.cfg's colours — the same `spz_theme_*` convars
-- every other SPiceZ UI reads, so one config block re-skins the loading screen
-- along with the rest.
--
-- Getting them here is the awkward part, because the screen is painted before
-- the usual route exists. spz-core pushes `SPZ:theme` at playerConnected, which
-- lands while this client still has no scripts running to catch it. So this
-- asks for the theme from two directions and takes whichever arrives:
--
--   1. Replicated convars. `setr spz_theme_*` is already on the client when the
--      first line of this file runs — instant, no round trip. Silent no-op if
--      the server uses a plain `set`, which is server-only.
--   2. A request to our own server script. Works whichever of `set` / `setr` the
--      server.cfg uses, which matters because most servers have these on `set`
--      and the loading screen is not worth a server.cfg migration to theme.
--
-- Whichever lands first paints; the other repaints the same values over it. The
-- screen is up for seconds waiting on a profile and on world streaming, so the
-- round trip is never the thing holding it up.

local THEME_KEYS = { 'accent', 'accent2', 'bg', 'bg2', 'danger', 'gold' }

-- The theme in force, kept so it can be reposted. Posting into the frame is
-- one-way with no acknowledgement, and the frame may not have attached its
-- listener yet — client scripts start while the loading screen is still loading
-- its own bundle, and a message sent into that gap is silently dropped. Sending
-- it again for a few seconds is cheaper than building a handshake for a surface
-- that lives fifteen seconds.
local theme     = nil
local themeRank = 0
local reposts   = 0

-- Which source a theme came from. The convars are the fast path but can be
-- stale or half-set; the server's answer is authoritative (it comes from
-- spz-core, so it carries `/spz reloadtheme` changes that never touched a
-- convar), and is allowed to replace them. Nothing replaces the server.
local RANK = { ['convars (setr)'] = 1, ['spz-core'] = 2, ['server'] = 2 }

--- Take a theme if it beats what we already have. Keys the server did not set
--- are dropped rather than filled with a default, so each one it leaves alone
--- keeps the value compiled into the UI's own CSS.
local function SetTheme(incoming, origin)
    if finished or type(incoming) ~= 'table' then return end

    local rank = RANK[origin] or 0
    if theme and rank <= themeRank then return end

    local out, any = {}, false
    for _, key in ipairs(THEME_KEYS) do
        local v = incoming[key]
        if type(v) == 'string' and v ~= '' then
            out[key] = v
            any = true
        end
    end
    if not any then return end

    theme, themeRank, reposts = out, rank, 0

    -- Posted here as well as from the loop below, so a reply that arrives after
    -- the loop has finished reposting still paints.
    Post({ eventName = 'spzTheme', theme = out })

    -- Without this line, "the loading screen is the wrong colour" is a question
    -- with no way to answer it short of adding it back.
    print(('^2[spz-loading] Theme from %s^7'):format(origin))
end

--- Route 1: replicated convars, read straight off the client. Instant and with
--- no round trip when server.cfg uses `setr`; empty when it uses a plain `set`,
--- which is server-only.
local function ConvarTheme()
    local out = {}
    for _, key in ipairs(THEME_KEYS) do
        local v = GetConvar('spz_theme_' .. key, '')
        if v ~= '' then out[key] = v end
    end
    return out
end

-- Route 2's reply, plus spz-core's own push on the chance it lands while the
-- screen is still up. Both are the same theme arriving from another direction.
RegisterNetEvent('spz-loading:theme', function(t) SetTheme(t, 'server') end)
RegisterNetEvent('SPZ:theme',         function(t) SetTheme(t, 'spz-core') end)

CreateThread(function()
    SetTheme(ConvarTheme(), 'convars (setr)')

    -- Bounded by the watchdog that takes the screen down anyway, so this can
    -- never outlive the thing it is painting.
    local deadline    = GetGameTimer() + 20000
    local nextRequest = 0

    while not finished and GetGameTimer() < deadline do
        if theme then
            -- Repeated past the point it can plausibly still be missed, then
            -- left alone: the frame has it, and the screen is not worth a
            -- message every quarter second for its whole life.
            if reposts < 12 then
                reposts = reposts + 1
                Post({ eventName = 'spzTheme', theme = theme })
            else
                return
            end
        elseif GetGameTimer() >= nextRequest then
            -- Asked repeatedly for the reason spz-spawn retries its own
            -- handshake: this runs as the client is still connecting, and the
            -- earliest attempts can be made before the server will hear them.
            TriggerServerEvent('spz-loading:requestTheme')
            nextRequest = GetGameTimer() + 1000
        end

        Wait(250)
    end

    if not theme and not finished then
        print('^3[spz-loading] No theme received — the screen is using its built-in palette. ' ..
              'Check spz_theme_* in server.cfg and that spz-loading/server/main.lua is running.^7')
    end
end)

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
