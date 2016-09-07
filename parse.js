'use strict';

module.exports = function(bot, you, from, args) {
    var recipients = args[0].split(bot.nickSeperator).slice(1);
    var command = args[0].split(bot.nickSeperator)[0].slice(bot.commandPrefix.length).toLowerCase();
    var out = bot.connection.send.bind(bot.connection, command);
    //If the command starts with the appropriate delimiter, and it was intended for you, go ahead
    if ((args[0].length > bot.commandPrefix.length) && args[0].startsWith(bot.commandPrefix) && (args[0].indexOf(bot.nickSeperator) == -1 || recipients.indexOf(you) > -1)) {
        //Check if the person issuing the command is authorized to do so
        if ((!bot.usePassword) || (bot.authorized.indexOf(from) > -1 || command == 'auth')) {
            try { //Dynamically fire the appropriate command
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
