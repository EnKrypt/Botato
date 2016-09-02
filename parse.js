'use strict';

module.exports = function(bot, from, args) {
    if ((args[0].length > bot.commandPrefix.length) && args[0].startsWith(bot.commandPrefix)) {
        var out = bot.connection.send.bind(bot.connection);
        var command = args[0].slice(bot.commandPrefix.length).toLowerCase();
        try {
            require('./commands/' + bot.noSpecialChars(command))(args.slice(1), out);
        } catch (e) {
            out(command + " is not a valid command");
        }
    }
}
