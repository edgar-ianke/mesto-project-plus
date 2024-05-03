import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}
export interface RequestWithUser extends Request {
  user?: { _id: string };
}
