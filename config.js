'use strict';

var imgur = require('imgur'),
    fork = require('child_process').fork,
    fs = require('fs-extra'),
    os = require('os'),
    path = require('path'),
    rls = require('readline-sync');

//Initialize some parameters that will be used before module.exports can be set
var autoUpdate = true;
var hasUpdate = false;
var botPath = __dirname;
var project = {};
var config = {};
var warning = "";
var showWarning = function(warn) {
    rls.question(warn, {
        hideEchoBack: true,
        mask: ''
    });
};

imgur.setClientId('0e74360592046d7');

//If the update/ directory exists, the program is waiting to apply an update
try {
    var stats = fs.statSync(path.join(botPath, 'update'));
        if (stats.isDirectory()) {
            hasUpdate = true;
        }
} catch (e) {}

//Some parameters are fetched from package.json
try {
    var projectFile = fs.readFileSync(path.join(botPath, 'package.json'), 'utf8');
    project = JSON.parse(projectFile);
} catch (e) {
    //Show the warning right in the beginning
    showWarning('The package.json file is missing from the working directory or it is not valid JSON. Auto updates will be disabled, and you might encounter unexpected behavior. Make sure the project was downloaded/installed properly. Press Enter to continue anyway');
    autoUpdate = false;
}

//Other parameters are fetched from a .botatorc file
try { //Check in working directory first
    var rcFile = fs.readFileSync(path.join(botPath, '.botatorc'), 'utf8');
    try {
        config = JSON.parse(rcFile);
    } catch (ex) {
        warning = 'The .botatorc file found in your working directory is not valid JSON. Press Enter to use default config values';
    }
} catch (e) {
    try { //Check in home directory next
        var rcHomeFile = fs.readFileSync(path.join(os.homedir(), '.botatorc'), 'utf8');
        try {
            config = JSON.parse(rcHomeFile);
        } catch (exh) {
            warning = 'The .botatorc file found in your home directory is not valid JSON. Press Enter to use default config values';
        }
    } catch (e) {
        warning = 'No .botatorc file found in working directory or your home directory. It is recommended to create one to password protect your bot and skip manually typing runtime arguments. With the default config values, everyone in the same network will have shell access to your device. Press Enter if you know what you\'re doing';
    }
}

//Finally bundle all the parameters into an object and export it
module.exports = {
    shells: [],
    history: [],
    authorized: [],
    name: project.name || 'Botato',
    executable: project.main || 'botato.js',
    version: project.version,
    release: 'alpha',
    path: botPath,
    imgur: imgur,
    hasUpdate: hasUpdate,
    updateURL: 'https://api.github.com/repos/EnKrypt/Botato/releases/',
    autoUpdate: (!autoUpdate) ? autoUpdate : ((typeof config.autoUpdate === 'undefined') ? autoUpdate : config.autoUpdate),
    updateInterval: config.updateInterval || 18000000,
    promptForArgs: (typeof config.promptForArgs === 'undefined') ? true : config.autoUpdate, //Set to false while running purely headless or for strictness testing
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
    doUpdate: function(bot, out) {
        out('Applying update');
        fs.copy(path.join(botPath, 'update/'), botPath, {
            clobber: true
        }, function() {
            fs.remove(path.join(botPath, 'update'), function() {
                out('Relaunching ' + bot.name);
                fork(bot.executable, bot.args);
            });
        });
    }
};
