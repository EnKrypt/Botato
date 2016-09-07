'use strict';

module.exports = function(bot, from, args, out) {
    out(bot.name + ' - version ' + bot.version);
    out('Release: ' + bot.release);
    out('Using password: ' + bot.usePassword);
    out(bot.shells.length + ' shell(s) open');
    out(bot.history.length + ' command(s) run');
    if (bot.hasUpdate) {
        out('There are pending updates. Restart this bot to apply them');
    }
}
