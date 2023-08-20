import LeaderboardContainer from "@/components/leaderboard/LeaderboardContainer";
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { ChessPlayer } from "@/types/chess";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const getPlayers = async (): Promise<ChessPlayer[]> => {
  "use server";
  const { rows } = await pool.query(
    "SELECT name, score, ROUND(rating::numeric, 0) as rating FROM players",
  );
  return rows;
};

export default async function Leaderboard() {
  try {
    // Score 기준으로 플레이어 목록 가져오기
    const players = await getPlayers();

    return (
      <LeaderboardContainer
        playersByScore={players.sort((a, b) => b.score - a.score)}
        playersByRating={players.sort((a, b) => b.rating - a.rating)}
      />
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
