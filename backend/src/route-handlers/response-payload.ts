import { IResponse } from '../common/interfaces';
import { getCurrentState } from '../router';
export const responsePayload:
  (message: string | Error, success: boolean) => Promise<IResponse> = async (message, success) => {
  const currentState = await getCurrentState();
  // console.log('state in responsePayload before setting it', currentState);
  const res: IResponse = {
    appState: currentState,
    message: message instanceof Error ? message.message : message,
    success,
  };
  return res;
};
