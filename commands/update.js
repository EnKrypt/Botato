'use strict';

var fs = require('fs-extra'),
    path = require('path'),
    request = require('request'),
    sv = require('semver'),
    unzip = require('unzip');

module.exports = function(bot, from, args, out, callback = function() {}, init = false) {
    out('Checking for updates');
    //Query github API for releases
    request({
        url: bot.updateURL + (args[0] ? 'tags/v' + args[0] : 'latest'),
        headers: {
            'User-Agent': bot.name
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var releaseInfo = JSON.parse(body);
            //If API indicates there is a newer version available
            if (sv.lt(bot.version, releaseInfo.tag_name)) {
                out('Downloading updates to ' + releaseInfo.tag_name);
                fs.remove(path.join(bot.path, 'update'), function() { //In case there was a previous unapplied update
                    fs.mkdir(path.join(bot.path, 'update'), function() {
                        var count = releaseInfo.assets.length;
                        var decrement = function() {
                            count -= 1;
                            //All resources downloaded
                            if (!count) {
                                bot.hasUpdate = true;
                                out('Update(s) downloaded');
                                //If this was run during the initial update check, the bot will go through with the update, else wait for restart
                                if (init) {
                                    callback();
                                } else {
                                    out('Restart required before updates take effect');
                                }
                            }
                        };
                        //Iterate through all resources in that update and download them
                        for (var key in releaseInfo.assets) {
                            if (releaseInfo.assets.hasOwnProperty(key)) {
                                request(releaseInfo.assets[key].browser_download_url).pipe(fs.createWriteStream(path.join(bot.path, 'update', releaseInfo.assets[key].name)).on('finish', function() {
                                    //If any resource is a zip file, unzip them
                                    if (releaseInfo.assets[key].content_type == 'application/zip') {
                                        fs.createReadStream(path.join(bot.path, 'update', releaseInfo.assets[key].name)).pipe(unzip.Extract({
                                            path: path.join(bot.path, 'update')
                                        }).on('close', function() {
                                            //Delete the zip file after extracting is complete
                                            fs.unlink(path.join(bot.path, 'update/', releaseInfo.assets[key].name));
                                            decrement();
                                        }));
                                    } else {
                                        decrement();
                                    }
                                }));
                            }
                        }
                    });
                });
            } else {
                out(bot.name + ' is up to date');
                callback();
            }
        } else {
            if (error) {
                out('Could not check for updates: Error code - ' + error.code);
            } else {
                out('Could not check for updates: API response code - ' + response.statusCode);
            }
            callback();
        }
    });
}
