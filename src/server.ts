import app from "./app";
import config from "./config";
import { initiateDB } from "./db";

app.listen(config.port,()=>{
  initiateDB();
  console.log(`Server is running on port: ${config.port}`);
})