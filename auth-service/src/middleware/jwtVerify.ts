import { eq } from "drizzle-orm";
import { db } from "../databaseConnection/database-connection";
import { jwtKeysTable } from "../db/schema/jwtKeys";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
interface AuthPayload extends JwtPayload {
  sub: string;
  roles: string[];
}

export const jwtVerify = asyncHandler(async (req:Request, res:Response, next:NextFunction)=>{
    console.log("Raw cookie header:", req.headers.cookie);
console.log("Parsed cookies:", req.cookies);

    const token = req.cookies?.access_token
    || req.headers?.authorization?.split(" ")[1];
    console.log("token ",token)
    if(!token ){
        throw new ApiError(401,"No token provided")
    }
    const decoded = jwt.decode(token, { complete: true })
    if(!decoded || typeof decoded === "string"){
        throw new ApiError(401,"Invalid token")
    }
    const kid = decoded.header.kid
    if(!kid){
        throw new ApiError(401,"missing kid in token")
    }
    const getpublickey = await db.select().from(jwtKeysTable).where(eq(jwtKeysTable.kid,kid))
    const publickey = getpublickey[0]?.publicKey
    if(!publickey){
        throw new ApiError(401,"public key not found for the given kid")
    }
    const payload = jwt.verify(token, publickey, {
    algorithms: ["RS256"],
    issuer: "auth-service",
    audience: "api-service",
  }) as AuthPayload;


  req.user = {
    userId: payload.sub,
    roles: payload.roles,
  };

 next();
})