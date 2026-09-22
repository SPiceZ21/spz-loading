fx_version 'cerulean'
game 'gta5'

name 'spz-loadscreen'
description 'SPiceZ-Core — Minimal Loading Screen'
version '1.4.0'
author 'SPiceZ-Core'

loadscreen 'ui/dist/index.html'
loadscreen_manual_shutdown 'yes'
loadscreen_cursor 'yes'   -- mouse cursor: volume slider + tip navigation

-- Owns ShutdownLoadingScreen. The screen is manual-shutdown, so without this
-- script nothing ever takes it down.
client_scripts {
  'client/main.lua',
}

-- Answers the client's request for the server.cfg theme. See server/main.lua:
-- the screen is painted before any push from spz-core could reach it.
server_scripts {
  'server/main.lua',
}

files {
  'ui/dist/index.html',
  'ui/dist/**/*',
}
