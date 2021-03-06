'use strict';

var crypto = require('crypto');

module.exports = function(bot, from, args, out) {
    var id = '';
    while (bot.shellWithIDexists(bot, id)) {
        id = crypto.randomBytes(3).toString('hex');
    }
    if (args[0]) {
        id = args[0];
    }
    var command = args.slice(1);
    out('Starting new shell instance with ID: ' + id);
    bot.addShell(bot, id, command);
    if (!command.length) {
        bot.makeInteractive(bot, id, out);
    }
}
