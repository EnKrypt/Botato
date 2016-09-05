'use strict';

var fork = require('child_process').fork,
    fs = require('fs-extra'),
    rls = require('readline-sync');

var config = {};
var warning = "";
var hasUpdate = false;
var showWarning = function(warn) {
    rls.question(warn, {
        hideEchoBack: true,
        mask: ''
    });
};

try {
    var stats = fs.statSync('update');
        if (stats.isDirectory()) {
            hasUpdate = true;
        }
} catch (e) {}

try {
    var rcFile = fs.readFileSync('.botatorc', 'utf8');
    try {
        config = JSON.parse(rcFile);
    } catch (ex) {
        showWarning('The .botatorc file that was found is not valid JSON. Press Enter to use default config values'); //Show the warning right here as there is no other appropriate place to do so
    }
} catch (e) {
    warning = 'No .botatorc file found in working directory. It is recommended to create one to password protect your bot and skip manually typing runtime arguments. With the default config values, everyone in the same network will have shell access to your device. Press Enter if you know what you\'re doing';
}

module.exports = {
    version: 'v0.1.0',
    release: 'alpha',
    name: 'Botato',
    shells: [],
    history: [],
    authorized: [],
    hasUpdate: hasUpdate,
    updateURL: 'https://api.github.com/repos/EnKrypt/Botato/release/',
    autoUpdate: (typeof config.autoUpdate === 'undefined') ? true : config.autoUpdate,
    updateInterval: config.updateInterval || 18000000,
    promptForArgs: config.promptForArgs || true, //Set to false while running purely headless or for strictness testing
    args: process.argv.slice(2).length ? process.argv.slice(2) : (config.args ? config.args : []),
    shortName: config.shortName || 'Bot',
    commandPrefix: config.commandPrefix || '!',
    shellPrefix: config.shellPrefix || '~',
    nickSeperator: config.nickSeperator || '@',
    usePassword: config.usePassword || false,
    password: config.password,
    warn: warning,
    showWarning: showWarning,
    //Offers basic protection from attacks via network-type and command names
    noSpecialChars: function(str) {
        if (/^[a-zA-Z0-9- ]*$/.test(str)) {
            return str;
        } else {
            throw new Error('Special characters not allowed');
        }
    },
    doUpdate: function(bot) {
        fs.readdir('./', function(err, list = []) {
            for (var i = 0; i < list.length; i++) {
                if (list[i] != 'update' && list[i] != '.botato' && list[i] != 'node_modules') {
                    fs.removeSync(list[i]);
                }
            }
            fs.copy('update/', './', {
                clobber: true
            }, function() {
                fs.remove('update', function() {
                    fork('botato.js', bot.args);
                });
            });
        });
    }
};
