import jwt from "jsonwebtoken";
import { db } from "../databaseConnection/database-connection";
import { getActiveJwtKey } from "./jwtBootstrap";

type UserPayload = {
  userId: string;
  roles: string[];
};

export async function generateAccessToken(
  payload: UserPayload
): Promise<string> {

  const {kid,privateKey} = getActiveJwtKey()

 

  const token = jwt.sign(
    {
      sub: payload.userId,
      roles: payload.roles,
      iss: "auth-service",
      aud: "api-service",
    },
    privateKey as string,
    {
      algorithm: "RS256",
      expiresIn: "10m",
      keyid: kid, 
    }
  );
   console.log("Private key:", privateKey);
console.log("Generated token:", token);

  return token;
}
