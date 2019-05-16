import SerialPort from 'serialport';
export interface IObject {
  [key: string]: any;
}
export interface IResponse {
  message?: string;
  success?: boolean;
  appState?: IAppState;
}
export interface IAppState {
  availablePorts?: SerialPort.PortInfo[];
  currentPort?: string;
  portIsOpen: boolean;
}
