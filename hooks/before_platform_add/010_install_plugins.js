#!/usr/bin/env node

//this hook installs all your plugins

// add your plugins to this list--either
// the identifier, the filesystem location
// or the URL
var pluginlist = [
    "https://github.com/Initsogar/cordova-webintent",
    "https://github.com/cowbell/cordova-plugin-geofence.git",
    "https://github.com/cowbell/cordova-plugin-geofence.git#:/tests",
    "http://git-wip-us.apache.org/repos/asf/cordova-plugin-test-framework.git",
    //"~/dev/js/cordova/plugins/geofence",
    "com.ionic.keyboard",
    "org.apache.cordova.geolocation",
    "org.apache.cordova.console"
];

// no need to configure below

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    sys.puts(stdout)
}

pluginlist.forEach(function(plug) {
    exec("cordova plugin add " + plug, puts);
});
