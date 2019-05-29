import { AsyncRoute } from '../common/types';
import { responsePayload } from './response-payload';
export const defaultGet: AsyncRoute = async (_request, response) => {
  // const list = await SerialPort.list();
  // currentState = {
  //   availablePorts: list,
  //   currentPort: sPort,
  //   portIsOpen: port.isOpen,
  // };
  response.json(await responsePayload('Appliction State', true));
};
