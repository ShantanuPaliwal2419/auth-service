import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        roles?: string[]; // optional since you don’t store roles in DB
      };
    }
  }
}

export {};
