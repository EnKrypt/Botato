'use-strict';

//This is the hook template for network-types
//To make your own network-type hook, create a class that extends this one
//Make sure all functions mentioned below are overriden
module.exports = class HookTemplate {
    constructor() {
        if (new.target === HookTemplate) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        /* Override 'argumentscheck'
         * Ensures that the arguments provided are valid for that network-type.
         * May prompt in the case of absent/invalid arguments.
         */
        if (this.argumentscheck === undefined) {
            throw new TypeError("Must override function 'argumentscheck' in network-type class");
        }

        /* Override 'connect'
         * Establishes connection. May be reused for reconnecting in case of a disconnect, depending on implementation.
         */
        if (this.connect === undefined) {
            throw new TypeError("Must override function 'connect' in network-type class");
        }

        /* Override 'send'
         * Well configured wrapper around the output method of the network-type library.
         */
        if (this.send === undefined) {
            throw new TypeError("Must override function 'send' in network-type class");
        }
    }
}
