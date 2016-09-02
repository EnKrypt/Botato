describe('Botato', function() {
    describe('Network Type', function() {
        describe('IRC', function() {
            var bot = {};
            beforeAll(function() {
                bot = require('../../config');
                bot.args = ['irc', 'workfra.me', '6697', 'true', '#workframe', '#bots', '#test'];
                bot.promptForArgs = false;
                bot.connection = new (require('../../NetworkHooks/irc'))(bot, require('../../parse'));
            });
            it('can pass the arguments check on given arguments', function() {
                bot.connection.argumentscheck();
                expect(true).toBe(true);
            });
            it('can connect to the given irc server and channels', function(done) {
                bot.connection.connect();
                var count = 0;
                bot.connection.connection.addListener('join', function(chan) {
                    count += 1;
                    if (count == 3) {
                        expect(true).toBe(true);
                        done();
                    }
                });
            }, 10000);
        });
    });
    describe('Command', function() {
        describe('!ping', function() {
            it('responds with given value', function() {
                require('../../commands/ping')({}, '', ['this', 'is', 'a', 'test'], function(out) {
                    expect(out).toBe('PONG this is a test');
                });
            });
        });
        describe('!auth', function() {
            it('adds a client having the right password to the authorized list', function() {
                var client = 'Test!Bot@D199B241.9A78455E.C6E678A9.IP';
                var bot = {
                    authorized: [],
                    password: 'sup3r s3cr3t passw0rd'
                };
                require('../../commands/auth')(bot, client, ['sup3r', 's3cr3t', 'passw0rd'], function() {});
                expect(bot.authorized.indexOf(client)).not.toBe(-1);
            });
        });
    });
});
