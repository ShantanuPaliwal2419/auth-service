import { eq } from "drizzle-orm";
import { db } from "../databaseConnection/database-connection";
import { userTable } from "../db/schema/user";
import { asyncHandler } from "../utils/AsyncHandler";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcryptjs"
import { ApiResponse } from "../utils/ApiResponse";

import { generateAccessToken } from "../utils/generateAcessToken";
import { createRefreshToken } from "../utils/generateRefreshToken";
export const Login = asyncHandler(async(req: Request, res: Response)=>{
 const {email,password} =  req.body
 const user = await db.select().from(userTable).where(eq(userTable.email, email))
 if(user.length===0){
    throw new ApiError(401,"user does not exist try signing up")
 }
 if(!user[0]?.password){
    throw new ApiError(401,"user does not have a password set")
 }
     const checkpassword =  await bcrypt.compare(password,user[0].password)
     if(!checkpassword){
        throw new ApiError(401,"password is incorrect")
     }
     const refreshToken= await createRefreshToken(user[0]?.id)
         const tokenacess =  await generateAccessToken({userId:user[0]?.id, roles:["user"]})
         if(!tokenacess || !refreshToken){
      throw new ApiError(500,"Error generating tokens")
     }
              res.cookie("access_token", tokenacess, {
  httpOnly: true,
  secure: false,      
  sameSite: "lax",     
  path: "/",           
  maxAge: 10 * 60 * 1000, 
})

       .cookie("refresh_token", refreshToken, {
         httpOnly: true,
         secure: false,
         sameSite: "lax",
         maxAge: 30 * 24 * 60 * 60 * 1000,
       })
       .status(201)
       .json(new ApiResponse(true, { user, tokenacess, refreshToken }, "User logged in successfully", ));
})
 export const emailVerified = asyncHandler(
  async (req: Request, res: Response) => {

    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (users.length === 0) {
      throw new ApiError(401, "Email not found");
    }

    if (users[0]?.isEmailVerified) {
      return res.status(200).json(
        new ApiResponse(true, null, "Email already verified")
      );
    }

    const updatedUser = await db
      .update(userTable)
      .set({ isEmailVerified: true })
      .where(eq(userTable.email, email))
      .returning();

    res.status(200).json(
      new ApiResponse(true, updatedUser, "Email verified successfully")
    );
  }
);
