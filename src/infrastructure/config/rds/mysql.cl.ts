import mysql, { Pool } from "mysql2/promise";
import { envCL } from "../envs/envs.cl";

let pool: Pool | null = null;

export function getPoolCL(): Pool {
  console.log("Creating MySQL connection pool for CL", envCL);
  if (!pool) {
    pool = mysql.createPool({
      host: envCL.MYSQL_HOST_CL,
      database: envCL.MYSQL_DB_CL,
      user: envCL.MYSQL_USER_CL,
      password: envCL.MYSQL_PASSWORD_CL,
      port: 3306,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableKeepAlive: true,
    });
  }
  return pool;
}
