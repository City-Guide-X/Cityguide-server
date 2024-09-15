import { IPayload } from './common.interface';
import { TSocket } from './socket.interface';

declare global {
  namespace Express {
    interface Locals {
      user: IPayload;
      io?: TSocket;
    }
  }
}

export {};
