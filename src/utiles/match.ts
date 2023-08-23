import "server-only";
import { Pool } from "pg";
import { ChessMatch } from "@/types/chess";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const getMatch = async (): Promise<ChessMatch[]> => {
  "use server";
  try {
    const { rows } = await pool.query(
      "SELECT *, ROUND(diff::numeric, 0) as diff FROM matches ORDER BY timestamp DESC",
    );
    return rows ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
