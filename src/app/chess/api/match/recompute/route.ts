import { Pool } from "pg";

import { ChessMatch, ChessPlayer } from "@/types/chess";
import { NextResponse } from "next/server";
import { getRatingDiff } from "@/app/chess/api/match/route";

// PostgreSQL 연결 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export async function POST() {
  // 임시 코드
  return NextResponse.json({ error: "Access denied" }, { status: 500 });

  try {
    await pool.query("BEGIN"); // 트랜잭션 시작
    await pool.query("UPDATE players SET rating = 1200, score = 0");

    const { rows: matches } = await pool.query<ChessMatch>(
      "SELECT * FROM matches ORDER BY timestamp",
    );

    for (const match of matches) {
      const { result, player_a, player_b, match_id } = match;
      const { rows: players } = await pool.query<ChessPlayer>(
        "SELECT * FROM players WHERE name IN ($1, $2)",
        [player_a, player_b],
      );

      const ratingA = players.find((p) => p.name === player_a)?.rating ?? 1200;
      const ratingB = players.find((p) => p.name === player_b)?.rating ?? 1200;

      const [scoreA, diff] = getRatingDiff({ result, ratingA, ratingB });
      const scoreB = 2 - scoreA;

      // Update ratings in the database
      const updateQuery =
        "UPDATE players SET rating = $1, score = score + $2 WHERE name = $3";
      await pool.query(updateQuery, [ratingA + diff, scoreA, player_a]);
      await pool.query(updateQuery, [ratingB - diff, scoreB, player_b]);
      await pool.query("UPDATE matches SET diff = $1 WHERE match_id = $2", [
        diff,
        match_id,
      ]);
    }
    await pool.query("COMMIT");
    return NextResponse.json("");
  } catch (error) {
    console.error(error);
    await pool.query("ROLLBACK"); // 에러가 발생하면 롤백
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
