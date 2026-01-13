import { eq } from "drizzle-orm";
import { db } from "../databaseConnection/database-connection";
import { userTable } from "../db/schema/user";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/generateAcessToken";
import { createRefreshToken, generateRefreshToken } from "../utils/generateRefreshToken";
import { ApiResponse } from "../utils/ApiResponse";
import type { Request, Response } from "express";
export const Register = asyncHandler(async(req:Request,res:Response)=>{
    const {username,password,email}= req.body
    if(!username || !password || !email){
        throw new ApiError(400,"Missing required fields")

    }
    const userExists = await db.select().from(userTable).where(eq(userTable.email,email))
    if(userExists.length>0){
        throw new ApiError(409,"User already exists")
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await db.insert(userTable).values({name:username,email,password:hashedPassword,isActive:true,isEmailVerified:false}).returning()
    if(!newUser[0]?.id){
        throw new ApiError(500,"user id not found")
    }
    const refreshToken= createRefreshToken(newUser[0]?.id)
    const tokenacess = generateAccessToken({userId:newUser[0]?.id, roles:["user"]})
    if(!tokenacess || !refreshToken){
 throw new ApiError(500,"Error generating tokens")
}
          res
  .cookie("access_token", tokenacess, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
  })
  .cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
  .status(201)
  .json(new ApiResponse(true, { newUser, tokenacess, refreshToken }, "User registered successfully", ));
    })