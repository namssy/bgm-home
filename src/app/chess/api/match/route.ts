import { Pool } from "pg";
import { NextResponse } from "next/server";
import { ChessMatchResult } from "@/types/chess";

// PostgreSQL 연결 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

function computeElo(ratingA: number, ratingB: number, scoreA: number): number {
  const k = 32;
  const expectedScoreA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  return ratingA + k * (scoreA - expectedScoreA);
}

export async function POST(req: Request) {
  const { playerA, playerB, result } = (await req.json()) as {
    playerA: string;
    playerB: string;
    result: ChessMatchResult;
  };

  if (
    !playerA ||
    !playerB ||
    !result ||
    !["winA", "winB", "draw"].includes(result)
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    await pool.query("BEGIN"); // 트랜잭션 시작
    // Fetch ratings of both players from the database
    const { rows: players } = await pool.query<{
      name: string;
      rating: number;
    }>("SELECT * FROM players WHERE name IN ($1, $2)", [playerA, playerB]);

    // 플레이어가 존재하지 않는다면 추가
    if (!players.find((p) => p.name === playerA)) {
      await pool.query("INSERT INTO players (name) VALUES ($1)", [playerA]);
    }
    if (!players.find((p) => p.name === playerB)) {
      await pool.query("INSERT INTO players (name) VALUES ($1)", [playerB]);
    }

    const ratingA = players.find((p) => p.name === playerA)?.rating ?? 1200;
    const ratingB = players.find((p) => p.name === playerB)?.rating ?? 1200;

    // Determine score based on result
    let scoreA;
    switch (result) {
      case "winA":
        scoreA = 2;
        break;
      case "winB":
        scoreA = 0;
        break;
      case "draw":
        scoreA = 1;
        break;
    }
    const scoreB = 2 - scoreA;

    const newRatingA = computeElo(ratingA, ratingB, scoreA / 2);
    const newRatingB = computeElo(ratingB, ratingA, scoreB / 2);

    // Update ratings in the database
    const updateQuery =
      "UPDATE players SET rating = $1, score = score + $2 WHERE name = $3";
    await pool.query(updateQuery, [newRatingA, scoreA, playerA]);
    await pool.query(updateQuery, [newRatingB, scoreB, playerB]);

    // Add the match result to a separate table (if you have one)
    await pool.query(
      "INSERT INTO matches (player_A, player_B, result) VALUES ($1, $2, $3)",
      [playerA, playerB, result],
    );

    await pool.query("COMMIT"); // 트랜잭션 커밋

    return NextResponse.json({
      playerA: { name: playerA, newRating: newRatingA },
      playerB: { name: playerB, newRating: newRatingB },
    });
  } catch (error) {
    console.error(error);
    await pool.query("ROLLBACK"); // 에러가 발생하면 롤백
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { rows: matches } = await pool.query(
      "SELECT * FROM matches ORDER BY timestamp DESC",
    );
    return NextResponse.json({ matches });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
