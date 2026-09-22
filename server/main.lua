-- spz-loading/server/main.lua
--
-- Answers the loading screen's request for the base UI theme.
--
-- This exists because the loading screen cannot get the theme the way every
-- other SPiceZ UI does. spz-core pushes `SPZ:theme` at playerConnected, which
-- lands while the client still has no scripts running to receive it, and the
-- screen has been painted for seconds by the time a later push arrives.
--
-- Reading the convars on the client instead only works if they are `setr`.
-- Most server.cfgs have them on `set` (server-only, which is the right default
-- for a convar nothing client-side used to need), and a loading screen is not
-- worth making people migrate their config. So the client asks, and this
-- answers — whichever way the convars are set.

local THEME_KEYS = { 'accent', 'accent2', 'bg', 'bg2', 'danger', 'gold' }

--- spz-core owns the theme, including `/spz reloadtheme` changes that never
--- touched the convars. Read it from there when it is running, and fall back to
--- the convars directly so this still answers on a server without spz-core.
local function GetTheme()
    if GetResourceState('spz-core') == 'started' then
        local ok, theme = pcall(function() return exports['spz-core']:GetTheme() end)
        if ok and type(theme) == 'table' and next(theme) then return theme end
    end

    local theme = {}
    for _, key in ipairs(THEME_KEYS) do
        local v = GetConvar('spz_theme_' .. key, '')
        if v ~= '' then theme[key] = v end
    end
    return theme
end

RegisterNetEvent('spz-loading:requestTheme', function()
    local src = source
    local theme = GetTheme()
    if not next(theme) then return end   -- nothing configured: the UI keeps its own palette
    TriggerClientEvent('spz-loading:theme', src, theme)
end)
