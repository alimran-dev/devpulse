import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.join(process.cwd(),"/.env")});

const config = {
  port: process.env.PORT,
  db_connection: process.env.DB_CONNECTION,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
}


export default config;