import { eq } from "drizzle-orm";
import { db } from "../databaseConnection/database-connection";
import { refreshTokenTable } from "../db/schema/refreshToken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import type { Request, Response } from "express";
import { generateAccessToken } from "../utils/generateAcessToken";
import { generateRefreshToken } from "../utils/generateRefreshToken";
import { ApiResponse } from "../utils/ApiResponse";
import crypto from "crypto";
export const revokerefreshToken=asyncHandler(async(req:Request,res:Response)=>{
    const refresh_token = req.cookies?.refresh_token || req.headers?.authorization?.split(" ")[1]

    if(!refresh_token){
        throw new ApiError(400,"No refresh token provided")

    }
    const hashedRefreshToken = crypto.createHash('sha256').update(refresh_token).digest('hex');
    const [fetchToken] = await db.select().from(refreshTokenTable).where(eq(refreshTokenTable.token_hash,hashedRefreshToken)).limit(1)
    ;
    console.log(fetchToken)
    if (!fetchToken ) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (fetchToken?.expires_at < new Date()) {
      throw new ApiError(401, "Refresh token expired");
    }
    const tokenRecord = fetchToken?.token_hash;
    if(!tokenRecord){
        throw new ApiError(400,"Invalid refresh token")
    }
    const generatenewacessToken = await generateAccessToken({userId:fetchToken.userId,roles:["user"]})
    const generaterefreshToken =  generateRefreshToken()
    const updaterefreshtoken = await db.transaction(async (tx) => {
      
      await tx
        .update(refreshTokenTable)
        .set({ revoked: true })
        .where(eq(refreshTokenTable.id, fetchToken.id));



      await tx.insert(refreshTokenTable).values(
        {
        userId: fetchToken.userId,
        token_hash: generaterefreshToken.hashedRefreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        replaced_by_token: fetchToken.id,
      });
    });
     
     res.cookie("access_token", generatenewacessToken, {
  httpOnly: true,
  secure: false,      
  sameSite: "lax",     
  path: "/",           
  maxAge: 10 * 60 * 1000, 
})

       .cookie("refresh_token", generaterefreshToken.refreshToken, {
         httpOnly: true,
         secure: false,
         sameSite: "lax",
         maxAge: 30 * 24 * 60 * 60 * 1000,
       })
       .status(200).json(new ApiResponse(true,updaterefreshtoken,"Refresh token revoked and new  acess token issued"))

})