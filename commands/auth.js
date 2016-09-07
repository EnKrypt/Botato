'use strict';

module.exports = function(bot, from, args, out) {
    //Don't run if user is already authorized
    if (bot.authorized.indexOf(from) == -1) {
        //Only authorize on password match
        if (bot.password == args.join(' ')) {
            bot.authorized.push(from);
            out(from.split('!')[0] + ' has been authorized');
        } else {
            out(from.split('!')[0] + ': That password is not correct');
        }
    }
}
