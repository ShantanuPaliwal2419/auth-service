import { asyncHandler } from "../utils/AsyncHandler";
import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";

export const Logout = asyncHandler(async (req: Request, res: Response) => {
  // Clear the cookies
  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: false,  // same as login cookie
      sameSite: "lax",
      path: "/",
    })
    .clearCookie("refresh_token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    })
    .status(200)
    .json(new ApiResponse(true, null, "Logged out successfully"));
});
