import LogContainer from "@/components/log/LogContainer";
import { Pool } from "pg";
import { NextResponse } from "next/server";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

// PostgreSQL 연결 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const getMatch = async () => {
  "use server";
  const { rows: matches } = await pool.query(
    "SELECT * FROM matches ORDER BY timestamp DESC",
  );
  return matches;
};

export default async function MatchLog() {
  try {
    const matches = await getMatch();
    return <LogContainer matches={matches} />;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
