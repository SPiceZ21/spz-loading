fx_version 'cerulean'
game 'gta5'

name 'spz-loadscreen'
description 'SPiceZ-Core — Minimal Loading Screen'
version '1.2.1'
author 'SPiceZ-Core'

loadscreen 'ui/dist/index.html'
loadscreen_manual_shutdown 'yes'
loadscreen_cursor 'yes'   -- mouse cursor: volume slider + tip navigation

files {
  'ui/dist/index.html',
  'ui/dist/**/*',
}
