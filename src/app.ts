import express, { type Application, type Request, type Response } from "express";
import { authRoutes } from "./modules/auth/auth.route";
import { issuesRoutes } from "./modules/issues/issues.route";
import globalErrorHandler from "./middlewares/globalErrorHandler";
const app: Application = express();

// middlewares
app.use(express.json());

app.get("/",(req: Request,res: Response)=>{
  res.status(200).json({
    success: true,
    message: "DevPulse Server is Running."
  })
})

app.use("/api/auth", authRoutes);
app.use("/api/issues", issuesRoutes);


app.use(globalErrorHandler)



export default app;