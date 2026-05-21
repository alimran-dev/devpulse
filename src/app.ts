import express from "express";
const app = express();


app.get("/",(req,res)=>{
  res.status(200).json({
    success: true,
    message: "DevPulse Server is Running."
  })
})




export default app;