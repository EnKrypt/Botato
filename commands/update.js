'use strict';

var fs = require('fs-extra'),
    request = require('request'),
    sv = require('semver'),
    unzip = require('unzip');

module.exports = function(bot, from, args, out, callback = function() {}, init = false) {
    out('Checking for updates');
    request({
        url: bot.updateURL + (args[0] ? 'tags/v' + args[0] : 'latest'),
        headers: {
            'User-Agent': bot.name
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var releaseInfo = JSON.parse(body);
            if (sv.lt(bot.version, releaseInfo.tag_name)) {
                out('Downloading updates to ' + releaseInfo.tag_name);
                fs.remove('update', function() {
                    fs.mkdir('update', function() {
                        var count = releaseInfo.assets.length;
                        var decrement = function() {
                            count -= 1;
                            if (!count) {
                                bot.hasUpdate = true;
                                out('Update(s) downloaded');
                                if (init) {
                                    callback();
                                } else {
                                    out('Restart required before updates take effect');
                                }
                            }
                        };
                        for (var key in releaseInfo.assets) {
                            if (releaseInfo.assets.hasOwnProperty(key)) {
                                request(releaseInfo.assets[key].browser_download_url).pipe(fs.createWriteStream('update/' + releaseInfo.assets[key].name).on('finish', function() {
                                    if (releaseInfo.assets[key].content_type == 'application/zip') {
                                        fs.createReadStream('update/' + releaseInfo.assets[key].name).pipe(unzip.Extract({
                                            path: 'update'
                                        }).on('close', function() {
                                            fs.unlink('update/' + releaseInfo.assets[key].name);
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
