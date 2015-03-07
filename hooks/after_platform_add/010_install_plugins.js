#!/usr/bin/env node

/**
 * Install all plugins listed in package.json
 * https://raw.githubusercontent.com/diegonetto/generator-ionic/master/templates/hooks/after_platform_add/install_plugins.js
 */
var spawnSync = require('spawn-sync');
var path = require('path');
var sys = require('sys');

var packageJSON = require('../../package.json');
var cmd = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
// var script = path.resolve(__dirname, '../../node_modules/cordova/bin', cmd);

packageJSON.cordovaPlugins = packageJSON.cordovaPlugins || [];
packageJSON.cordovaPlugins.forEach(function (plugin) {
    var result = spawnSync('cordova', ['plugin','add', plugin]);
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
});
