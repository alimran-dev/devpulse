import { pool } from "../../db";
import type { IUser } from "../auth/auth.interface";
import type { IGetAllIssueQuery, IIssue } from "./issues.interface";

const getSingleIssueFromDB = async (payload: { id: number }) => {
  const { id } = payload;
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id=$1
    `,
    [id],
  );
  const reporterResult = await pool.query(
    `
    SELECT * FROM users
    WHERE id=$1
    `,
    [issueResult.rows[0]?.reporter_id],
  );
  const reporter = {
    id: reporterResult.rows[0].id,
    name: reporterResult.rows[0]?.name,
    role: reporterResult.rows[0]?.role,
  };
  const result = { ...issueResult.rows[0], reporter: reporter };
  delete result["reporter_id"];
  return result;
};

const getAllIssuesFromDB = async (payload: IGetAllIssueQuery) => {
  let { sort, type, status } = payload;
  let result = await pool.query(`
    SELECT * FROM issues
    ORDER BY created_at ASC
    `);
  if (sort === "newest") {
    result = await pool.query(`
      SELECT * FROM issues
      ORDER BY created_at DESC
      `);
  }
  console.log(result.rows);
  if (type === "bug" || type === "feature_request") {
    result.rows = result.rows.filter((issue) => issue.type === type);
  }
  if (["open", "in_progress", "resolved"].includes(status as string)) {
    result.rows = result.rows.filter((issue) => issue.status === status);
  }
  const current = await Promise.all(
    result.rows.map(async (row) => {
      const reporterResult = await pool.query(
        `
      SELECT * FROM users
      WHERE id=$1
      `,
        [row.reporter_id],
      );
      const reporter = {
        id: reporterResult.rows[0]?.id,
        name: reporterResult.rows[0]?.name,
        role: reporterResult.rows[0]?.role,
      };
      // console.log("reporter", reporter);
      delete row["reporter_id"];
      return await { ...row, reporter: reporter };
    }),
  );
  // console.log(current);
  return current;
};

const createIssueIntoDB = async (payload: IIssue) => {
  const { title, description, type, reporter_id } = payload;
  const result = await pool.query(
    `
    INSERT INTO issues(title, description, type, reporter_id)
    VALUES($1,$2,$3,$4) RETURNING *
    `,
    [title, description, type, reporter_id],
  );
  console.log(result.rows[0]);
  return result.rows[0];
};

const updateIssueIntoDB = async (payload: IIssue, user: IUser, id: number)=>{
  const {title, description, type} = payload;
  const resultIssue = await pool.query(`
    SELECT * FROM issues
    WHERE id=$1
    `,[id]);
  if(resultIssue.rows.length===0){
    throw new Error("Issue not available");
  }
  const { reporter_id}=resultIssue.rows[0];
  if(user?.role==="contributor" && reporter_id!==user?.id){
    throw new Error("Forbidden");
  }
  const result = await pool.query(`
    UPDATE issues
    SET title=$1, description=$2, type=$3
    WHERE id=$4
    RETURNING *
    `,[title,description,type, id]);
  return result.rows[0];
}

export const issuesServices = {
  getSingleIssueFromDB,
  getAllIssuesFromDB,
  createIssueIntoDB,
  updateIssueIntoDB
};
