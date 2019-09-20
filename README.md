# media-capture-file
Cordova app using cordova-plugin-file and cordova-plugin-media-capture.

## Running
- `npm install`
- `cordova platform add android`
- `cordova emulate android` or `cordova run android`

## The issue (Android)
After using media capture to record a video, the idea is to get the recorded file using the file-plugin, however the FileReader always return `this: null`, even though the exact same code works for iOS.

More details [here](https://github.com/apache/cordova-plugin-file/issues/348).
