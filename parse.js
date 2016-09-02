'use strict';

module.exports = function(bot, from, args) {
    var out = bot.connection.send.bind(bot.connection);
    var command = args[0].slice(bot.commandPrefix.length).toLowerCase();
    if (bot.usePassword || (bot.authorized.indexOf(from) > -1 || command == 'auth')) {
        if ((args[0].length > bot.commandPrefix.length) && args[0].startsWith(bot.commandPrefix)) {
            try {
                require('./commands/' + bot.noSpecialChars(command))(bot, from, args.slice(1), out);
            } catch (e) {
                out(command + " is not a valid command");
            }
        }
    } else {
        out(from.split('!')[0] + ': Unauthorized');
    }
}
