'use strict';

var os = require('os'),
    request = require('request');

module.exports = function(bot, from, args, out) {
    if (!args.length) {
        global(out, function() {
            out(' \r\nInterface | MAC address | IP address');
            local(out);
        }, true);
    } else if (args[0].toLowerCase() == 'global') {
        global(out, function() {}, false);
    } else if (args[0].toLowerCase() == 'local') {
        local(out);
    } else {
        out('!address: Invalid parameter');
    }
}

var global = function(out, callback, noargs) {
    request('https://api.ipify.org', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            out((noargs ? 'Public IP: ' : '') + body);
        } else {
            if (error) {
                out('Could not fetch public IP: Error code - ' + error.code);
            } else {
                out('Could not fetch public IP: API response code - ' + response.statusCode);
            }
        }
        callback();
    });
};

var local = function(out) {
    var interfaces = os.networkInterfaces();
    for (var key in interfaces) {
        if (interfaces.hasOwnProperty(key)) {
            for (var index in interfaces[key]) {
                if (interfaces[key].hasOwnProperty(index)) {
                    if (interfaces[key][index].family == 'IPv4') {
                        out(key + ' | ' + interfaces[key][index].mac + ' | ' + interfaces[key][index].address);
                    }
                }
            }
        }
    }
};
