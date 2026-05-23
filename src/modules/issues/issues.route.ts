import { Router } from "express";
import Auth from "../../middlewares/auth";
import { issuesController } from "./issues.controller";

const router = Router();

router.get("/:id", issuesController.getSingleIssue);

router.get("/",issuesController.getAllIssues);

router.post("/",Auth("contributor","maintainer"), issuesController.createIssue);

export const issuesRoutes = router;