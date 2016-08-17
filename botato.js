'use strict';

//Initialize bot with some basic properties
var bot = {
    version: 0.1,
    release: 'alpha',
    name: 'Botato',
    shortname: 'Bot',
    connection: {},
    args: process.argv.slice(2)
};

//Offers basic protection from attacks via network-type and command names
bot.nospecialchars = function(str) {
    if (/^[a-zA-Z0-9- ]*$/.test(str)) {
        return str;
    } else {
        throw new Error('Special characters not allowed');
    }
};

if (!bot.args.length) {
    console.log('Usage : node botato.js network-type [args...]');
} else {
    try {
        bot.connection = new (require('./NetworkHooks/' + bot.nospecialchars(bot.args[0])))(bot)
    } catch (e) {
        console.log('No such network-type - ' + bot.args[0]);
        return;
    }
    bot.connection.connect();
    //That's pretty much it. Reconecting and errors are handled internally by network-type
}
