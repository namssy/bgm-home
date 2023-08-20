import "server-only";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const getMatch = async () => {
  const { rows: matches } = await pool.query(
    "SELECT * FROM matches ORDER BY timestamp DESC",
  );
  return matches;
};
