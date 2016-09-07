'use strict';

var ds = require('desktop-screenshot'),
    fs = require('fs-extra'),
    path = require('path');

module.exports = function(bot, from, args, out) {
    ds(path.join(bot.path, 'screenshot.png'), function(error, complete) {
        if (error) {
            out('Failed to get screenshot. Make sure you\'re not trying to run this command on a headless server');
            console.log(error);
        } else {
            bot.imgur.uploadFile(path.join(bot.path, 'screenshot.png')).then(function(result) {
                out(result.data.link);
                fs.unlink(path.join(bot.path, 'screenshot.png'));
            }).catch(function(err) {
                out('Failed to upload screenshot to imgur: ' + err.message);
            });
        }
    });
}
