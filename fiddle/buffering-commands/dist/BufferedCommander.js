"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
class BufferedCommander extends events.EventEmitter {
    constructor() {
        super(...arguments);
        this.commands = [];
    }
    emitHello(name) {
        this.emit('hello', name);
    }
}
exports.BufferedCommander = BufferedCommander;
