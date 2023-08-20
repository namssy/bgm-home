import LogContainer from "@/components/log/LogContainer";
import { Pool } from "pg";
import { NextResponse } from "next/server";
// PostgreSQL 연결 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export default async function MatchLog() {
  try {
    const { rows: matches } = await pool.query(
      "SELECT * FROM matches ORDER BY timestamp DESC",
    );
    return <LogContainer matches={matches} />;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
