'use strict';

var irc = require('irc'),
    rls = require('readline-sync');

var HookTemplate = require('./hook');

module.exports = class Hook extends HookTemplate {
    constructor(bot, perform) {
        super(); //To ensure abstraction checking
        this.bot = bot;
        this.perform = perform;
        this.reconnectInterval = 5;
    }

    argumentscheck() { //Checks input validity and recursively prompts wherever required
        var resolve = function(complaint, showComplaint, prompt) {
            if (this.bot.promptForArgs) {
                return rls.question((showComplaint ? complaint + '\n' : '') + prompt);
            }
            throw new TypeError(complaint);
        }.bind(this);
        if (this.bot.args.length < 2) {
            this.bot.args.push(resolve('Insufficient number of arguments', false, 'Host: '));
        } else if (this.bot.args.length < 3) {
            this.bot.args.push(resolve('Insufficient number of arguments', false, 'Port (Default is 6667): ') || '6667');
        } else if (this.bot.args.length < 4) {
            this.bot.args.push(resolve('Insufficient number of arguments', false, 'SSL/TLS? true|false (Default is false): ') || 'false')
        } else if (this.bot.args.length < 5) {
            this.bot.args = this.bot.args.concat(resolve('Insufficient number of arguments', false, 'Channel (Space seperated if multiple): ').split(' '));
        } else {
            this.host = this.bot.args[1]
            if (!/^\d+$/.test(this.bot.args[2])) {
                this.bot.args[2] = resolve('Port should be an integer value.', true, 'Port (Default is 6667): ') || '6667'
            } else if (("" + this.bot.args[3]).toLowerCase() != 'true' && ("" + this.bot.args[3]).toLowerCase() != 'false') {
                this.bot.args[3] = resolve('SSL/TLS option needs to be either true or false.', true, 'SSL/TLS? true|false (Default is false): ') || 'false'
            } else {
                this.port = parseInt(this.bot.args[2]);
                this.secure = ("" + this.bot.args[3]).toLowerCase() == 'true';
                for (var i = 4; i < this.bot.args.length; i++) {
                    if ((this.bot.args[i].length > 24) || (!/^[a-zA-Z0-9- ]*$/.test(this.bot.args[i].slice(1))) || (this.bot.args[i].charAt(0) != '#')) {
                        this.bot.args = this.bot.args.slice(0, 4).concat(resolve('All channel names should start with #, be less than 24 characters and not contain special characters.', true, 'Channel (Space seperated if multiple): ').split(' '));
                        return this.argumentscheck();
                    }
                }
                this.expectedChannels = this.bot.args.slice(4)
                //Checking done. Safe to leave this function now.
                return;
            }
        }
        return this.argumentscheck();
    }

    connect() {
        this.connection = new irc.Client(this.host, this.bot.shortName, {
            autoRejoin: true,
            port: this.port,
            userName: this.bot.shortName,
            realName: this.bot.name,
            channels: this.expectedChannels,
            secure: this.secure,
            selfSigned: true,
            floodProtection: true,
            floodProtectionDelay: 1000,
            retryDelay: this.reconnectInterval * 1000
        });

        //Handlers for incoming messages and error events
        this.connection.addListener('error', function(message) {
            console.log("ERROR", message);
        });
        this.connection.addListener('raw', function(message) {
            if (message.rawCommand=='PRIVMSG'){
                this.perform(this.bot, this.connection.nick, message.prefix, message.args.slice(1).join(' ').trim().split(' '));
            }
        }.bind(this));
    }

    send(command, message, showCommand=false) {
        //Output to every channel connected
        //TODO: Implement channel suppressing
        for (var key in this.connection.chans) {
            if (this.connection.chans.hasOwnProperty(key)) {
                this.connection.say(key, (showCommand ? (command + ': ') : '') + message);
            }
        }
    }
}
