import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import type { Request, Response, NextFunction } from "express";
export const checkRouteforJwtVerify = asyncHandler((req:Request,res:Response,next:NextFunction)=>{
       res.status(200).json( new ApiResponse(true,null,"Route is protected and JWT is verified"))
})