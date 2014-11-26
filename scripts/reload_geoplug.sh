#!/bin/bash

cordova plugin rm com.cowbell.cordova.geofence
cordova plugin rm com.cowbell.cordova.geofence.tests

cordova plugin add ~/dev/js/cordova/plugins/geofence
cordova plugin add ~/dev/js/cordova/plugins/geofence/tests

cordova prepare
