export interface IObject {
  [key: string]: any;
}

export interface IAction {
  type: string;
  url?: string;
}

export interface IPostAction extends IAction {
  body: IObject;
  // url?: string;
}

export interface IOption {
  method: string;
  url: string;
  async: boolean;
  type?: string;
  body?: IObject;
  setJSONHeader?: boolean;
  isForm?: boolean;
  formData?: FormData;
}

export interface IParseError {
  raw: string;
  err: Error;
}
