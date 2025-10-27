import mysql, { Pool } from "mysql2/promise";
import { envPE } from "../envs/envs.pe";

let pool: Pool | null = null;

export function getPoolPE(): Pool {
  console.log("Creating MySQL connection pool for PE", envPE);
  if (!pool) {
    pool = mysql.createPool({
      host: envPE.MYSQL_HOST_PE,
      database: envPE.MYSQL_DB_PE,
      user: envPE.MYSQL_USER_PE,
      password: envPE.MYSQL_PASSWORD_PE,
      port: 3306,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableKeepAlive: true,
    });
  }

  return pool;
}
