import type { Request, Response } from "express";
import { issuesServices } from "./issues.service";
import { StatusCodes } from "http-status-codes";

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await issuesServices.getSingleIssueFromDB({
      id: parseInt(id),
    });
    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error?.message,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesServices.getAllIssuesFromDB(req.query);
    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error?.message,
    });
  }
};

const createIssue = async (req: Request, res: Response) => {
  try {
    // const {} = req.user;
    const result = await issuesServices.createIssueIntoDB({
      ...req.body,
      reporter_id: req.user?.id,
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error?.message,
    });
  }
};

export const issuesController = {
  getSingleIssue,
  getAllIssues,
  createIssue,
};
