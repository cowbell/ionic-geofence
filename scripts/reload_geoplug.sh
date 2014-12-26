#!/bin/bash

cordova plugin rm com.cowbell.cordova.geofence
cordova plugin rm com.cowbell.cordova.geofence.tests

cordova plugin add ~/dev/cordova-plugin-geofence
cordova plugin add ~/dev/cordova-plugin-geofence/tests

cordova prepare
