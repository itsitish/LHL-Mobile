# LHL-Mobile
LHL mobile App. Application developed in ionic and angular to control the light module. Can connect to the device through BLE plugin and uses write services.


# Prerequisites:

Node 12~

Ionic 4.12~

Angular 10~

Android sdk and gradle required for android build

Xcode and cocoapods required for ios build


# Build Steps:


cd to lhl-mobile/ble

run npm i

then ionic cordova platform add android

then ionic cordova build android


# Current Issues:
Color picker returns wrong or undefined values.

Compatibility with ios devices.

# BLE documentation:
https://github.com/randdusing/cordova-plugin-bluetoothle#read


# Color picker documentation:
https://www.npmjs.com/package/ngx-color
