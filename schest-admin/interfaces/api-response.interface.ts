export interface IResponseInterface<T = any> {
  statusCode: number;
  message: string;
  token?: string;
  data?: T;
}
