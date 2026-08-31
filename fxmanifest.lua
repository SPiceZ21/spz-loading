fx_version 'cerulean'
game 'gta5'

name 'spz-loadscreen'
description 'SPiceZ-Core — Minimal Loading Screen'
version '1.2.1'
author 'SPiceZ-Core'

loadscreen 'ui/dist/index.html'
loadscreen_manual_shutdown 'yes'
loadscreen_cursor 'yes'   -- mouse cursor: volume slider + tip navigation

-- Owns ShutdownLoadingScreen. The screen is manual-shutdown, so without this
-- script nothing ever takes it down.
client_scripts {
  'client/main.lua',
}

files {
  'ui/dist/index.html',
  'ui/dist/**/*',
}
