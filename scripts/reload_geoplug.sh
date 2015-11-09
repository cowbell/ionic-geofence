#!/bin/bash

cordova plugin rm cordova-plugin-geofence
cordova plugin rm cordova-plugin-geofence-test

cordova plugin add ~/dev/js/cordova/plugins/geofence
cordova plugin add ~/dev/js/cordova/plugins/geofence/tests

cordova prepare
