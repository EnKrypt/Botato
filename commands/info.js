'use strict';

module.exports = function(bot, from, args, out) {
    //If no args, display verbose
    if (!args.length) {
        out(bot.name + ' - version ' + bot.version);
        out('Release: ' + bot.release);
        out('Using password: ' + bot.usePassword);
        out(bot.shells.length + ' shell(s) open');
        out(bot.history.length + ' command(s) run');
        if (bot.hasUpdate) {
            out('There are pending updates. Restart this bot to apply them');
        }
    } else if (args[0].toLowerCase() == 'version') {
        out(bot.version);
    } else if (args[0].toLowerCase() == 'updates') {
        if (bot.hasUpdate) {
            out('There are pending updates. Restart this bot to apply them');
        } else {
            out('No updates waiting to be applied. Run !update to check for available updates');
        }
    } else {
        out('Invalid parameter', true);
    }
}
