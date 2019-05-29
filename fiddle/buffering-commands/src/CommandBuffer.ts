import events = require('events');

declare interface ICommandBuffer {
  unshiftCommand: () => void;
  on(event: 'hello', listener: (name: string) => void): this;
  on(event: string, listener: () => void): this;
  on(event: 'command', listener: (cmd?: string) => void): this;
}
export class CommandBuffer extends events.EventEmitter implements ICommandBuffer {
  private _commands: string[] = [];

  public emitHello(name: string) {
    this.emit('hello', name);
  }
  public emitCommand(cmd?: string) {
    this.emit('command', cmd);
  }
  public get commands() {
    return this._commands;
  }
  public set commands(cmds: string[]) {
    this._commands = [...cmds];
  }
  public unshiftCommand() {
    this._commands.splice(0, 1);
  }
}
