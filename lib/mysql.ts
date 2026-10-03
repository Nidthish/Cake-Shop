import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getMySqlPool(): mysql.Pool | null {
  if (pool) return pool;

  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "1122",
      database: process.env.MYSQL_DATABASE || "lollipop_db",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    return pool;
  } catch (err) {
    console.warn("⚠️ [MySQL Connection Pool Init Notice]:", err);
    return null;
  }
}
