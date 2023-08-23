import "server-only";
import { Pool } from "pg";
import { ChessPlayer } from "@/types/chess";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const getPlayers = async (): Promise<ChessPlayer[]> => {
  'use server'
  try {
    const { rows } = await pool.query(
        "SELECT name, score::float / 2 as score, ROUND(rating::numeric, 0) as rating FROM players",
    );
    return rows ?? [];
  } catch (error) {
    console.error(error)
    return []
  }
};
