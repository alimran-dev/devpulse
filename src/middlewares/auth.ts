import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import type { IUser } from "../modules/auth/auth.interface";
import { pool } from "../db";

const Auth=(...roles: IUser['role'][])=>{
  return async (req: Request,res: Response,next: NextFunction)=>{
    // console.log(req.headers.authorization);
    const token = req.headers.authorization;
    if(!token){
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized"
      })
    }
    const decoded = await jwt.verify(token,config.access_token_secret) as JwtPayload;
    // console.log(decoded);
    const result = await pool.query(`
      SELECT * FROM users
      WHERE id=$1
      `,[decoded.id]);
    if(result.rows.length===0){
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid user."
      })
    }
    if(!roles.length && !roles.includes(decoded.role)){
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Forbidden"
      })
    }
    req.user=result.rows[0];
    next();
  }
}

export default Auth;