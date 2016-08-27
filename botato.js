'use strict';

//Initialize bot with required configuration
var bot = require('./config');

if (!bot.args.length) {
    console.log('Usage : node botato.js network-type [args...]\nOr have the network-type and arguments specified in a .botatorc file');
} else {
    try {
        bot.connection = new (require('./NetworkHooks/' + bot.noSpecialChars(bot.args[0])))(bot)
    } catch (e) {
        console.log('No such network-type - ' + bot.args[0]);
        return;
    }
    if (bot.warn) {
        bot.showWarning(bot.warn);
    }
    bot.connection.argumentscheck();
    bot.connection.connect();
    //That's pretty much it. Reconecting and errors are handled internally by network-type
}
