import type { Request, Response } from "express";
import { authServices } from "./auth.service";
import { StatusCodes } from "http-status-codes";

const signupUser=async(req: Request,res: Response)=>{
  try {
    const result = await authServices.signupUserIntoDB(req.body);
    const {password, ...user} = result.rows[0];
    // console.log(user);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: user
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error?.message,
    })
  }
}

const loginUser = async(req: Request, res: Response)=>{
  try {
    const result = await authServices.loginUserFromDB(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data: result
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error?.message
    })    
  }
}

export const authController = {
  signupUser,
  loginUser
}