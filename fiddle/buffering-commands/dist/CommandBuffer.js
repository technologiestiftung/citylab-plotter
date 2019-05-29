"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
class CommandBuffer extends events.EventEmitter {
    constructor() {
        super(...arguments);
        this._commands = [];
    }
    emitHello(name) {
        this.emit('hello', name);
    }
    emitCommand(cmd) {
        this.emit('command', cmd);
    }
    get commands() {
        return this._commands;
    }
    set commands(cmds) {
        this._commands = [...cmds];
    }
    unshiftCommand() {
        this._commands.splice(0, 1);
    }
}
exports.CommandBuffer = CommandBuffer;
