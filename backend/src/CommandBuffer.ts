import events = require('events');
import { PlotterStates } from './common/enums';

enum PlotterEvents {
  hello = 'hello',
  command = 'command',
}

declare interface ICommandBuffer {
  // state: 'busy' | 'done' | undefined;
  unshiftCommand: () => void;
  on(event: PlotterEvents.hello, listener: (name: string) => void): this;
  on(event: string, listener: () => void): this;
  on(event: PlotterEvents.command, listener: (cmd?: string) => void): this;
}

export class CommandBuffer extends events.EventEmitter implements ICommandBuffer {

  private _commands: string[] = [];
  private _state: PlotterStates = PlotterStates.ready;

  public emitHello(name: string) {
    this.emit(PlotterEvents.hello, name);
  }

  public emitCommand(cmd?: string) {
    this._state = PlotterStates.busy;
    this.emit(PlotterEvents.command, cmd);
  }
  public unshiftCommand() {
    if (this._commands.length > 0) {
      this._commands.splice(0, 1);
    }
    if (this._commands.length === 0) {
      this._state = PlotterStates.ready;
    }
  }
// Getters and Setters
  public get commands() {
    return this._commands;
  }
  public set commands(cmds: string[]) {
    this._commands = [...cmds];
  }

  public set state(st: PlotterStates) {
    this._state = st;
  }
  public get state() {
    return this._state;
  }
}
