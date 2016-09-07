#!/usr/bin/env node

'use strict';

//Initialize bot with required configuration
var bot = require('./config');

if (!bot.args.length) {
    console.log('Usage : node botato.js network-type [args...]\nOr have the network-type and arguments specified in a .botatorc file');
} else if ((bot.commandPrefix == bot.shellPrefix) || (bot.commandPrefix == bot.nickSeperator) || (bot.shellPrefix == bot.nickSeperator)) {
    console.log('Delimiters need to be distinct. Check your .botatorc file and change any reused configurations');
} else {
    try {
        //Dynamically load the network-type hook
        bot.connection = new(require('./NetworkHooks/' + bot.noSpecialChars(bot.args[0])))(bot, require('./parse'));
    } catch (e) { //If it cannot load the requested network-type, display error and quit
        if (e.code === 'MODULE_NOT_FOUND') {
            console.log('No such network-type - ' + bot.args[0]);
        } else {
            console.log(e);
        }
        return;
    }

    //Display any pending warnings before the bot runs
    if (bot.warn) {
        bot.showWarning(bot.warn);
        bot.warn = "";
    }

    bot.connection.argumentscheck();

    //Reusable function that will be divided and repeated during the auto update process
    (function run(isCallback) {
        //Check for updates in the beginning, and set the auto update timer
        if (bot.autoUpdate && (!isCallback)) {
            require('./commands/update')(bot, '', [], console.log, run.bind(this, true), true);
            setInterval(function() {
                require('./commands/update')(bot, '', [], bot.connection.send.bind(bot.connection, 'update'));
            }, bot.updateInterval);
            return;
        }
        if (bot.hasUpdate) {
            bot.doUpdate(bot, console.log);
        } else {
            console.log('Connecting with args: ', bot.args);
            bot.connection.connect();
            //That is all. Reconecting and errors are handled internally by network-type
        }
    })(false);
}
