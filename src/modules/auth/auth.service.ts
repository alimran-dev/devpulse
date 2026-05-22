import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";
import jwt from "jsonwebtoken"
import config from "../../config";

const signupUserIntoDB=async(payload: IUser)=>{
  const {name, email, password, role} = payload;
  const hashedPass = await bcrypt.hash(password,10);
  const result = await pool.query(`
    INSERT INTO users(name, email, password, role)
    VALUES($1,$2,$3,$4) RETURNING *
    `,[name, email, hashedPass, role]);
  return result;
}

const loginUserFromDB=async(payload: {email: string, password: string})=>{
  // console.log(payload);
  const {email, password} = payload;
  const result = await pool.query(`
    SELECT * FROM users
    WHERE email=$1
    `,[email]);
  if(result.rows.length===0){
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const passMatched = await bcrypt.compare(password, user?.password);
  if(!passMatched){
    throw new Error("Invalid User");
  }
  const jwtPayload={
    id: user?.id,
    name: user?.name,
    role: user?.role,
  }
  const token = await jwt.sign(jwtPayload,config.access_token_secret, {expiresIn: '1d'});
  delete user?.password;
  const data = {
    token,
    user 
  }
  return data;
}


export const authServices = {
  signupUserIntoDB,
  loginUserFromDB
}