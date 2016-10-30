'use strict';

var crypto = require('crypto');

module.exports = function(bot, from, args, out) {
    var id = crypto.randomBytes(3).toString('hex');
    if (args[0]) {
        id = args[0];
    }
    var command = args.slice(1).join(' ');
    out('Starting new shell instance with ID: ' + id);
    bot.addShell(bot, id, command);
    if (!command) {
        bot.makeInteractive(bot, id, out);
    }
}
