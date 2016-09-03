'use strict';

module.exports = function(bot, you, from, args) {
    var recipients = args[0].split(bot.nickSeperator).slice(1);
    var command = args[0].split(bot.nickSeperator)[0].slice(bot.commandPrefix.length).toLowerCase();
    var out = bot.connection.send.bind(bot.connection, command);
    if ((args[0].length > bot.commandPrefix.length) && args[0].startsWith(bot.commandPrefix) && (args[0].indexOf(bot.nickSeperator) == -1 || recipients.indexOf(you) > -1)) {
        if ((!bot.usePassword) || (bot.authorized.indexOf(from) > -1 || command == 'auth')) {
            try {
                require('./commands/' + bot.noSpecialChars(command))(bot, from, args.slice(1), out);
            } catch (e) {
                if (e.code === 'MODULE_NOT_FOUND') {
                    out(command + " is not a valid command");
                } else {
                    console.log(e);
                }
            }
        } else {
            out(from.split('!')[0] + ': Unauthorized');
        }
    }
}
