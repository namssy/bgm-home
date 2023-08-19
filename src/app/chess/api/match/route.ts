import { NextApiResponse } from "next";
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

function computeElo(ratingA: number, ratingB: number, scoreA: number): number {
  const k = 32;
  const expectedScoreA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  return ratingA + k * (scoreA - expectedScoreA);
}

export async function POST(req: Request) {
  const { playerA, playerB, result } = (await req.json()) as {
    playerA: string;
    playerB: string;
    result: "winA" | "winB" | "draw";
  };

  console.log(playerA, playerB, result);

  if (
    !playerA ||
    !playerB ||
    !result ||
    !["winA", "winB", "draw"].includes(result)
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    console.log({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });
    // 테이블이 존재하는지 확인하고 없으면 생성
    await pool.query(`
            CREATE TABLE IF NOT EXISTS players (
                player_id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                rating INT DEFAULT 1200,
                matches_played INT DEFAULT 0,
                wins INT DEFAULT 0,
                losses INT DEFAULT 0,
                draws INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS matches (
                match_id SERIAL PRIMARY KEY,
                playerA VARCHAR(255) NOT NULL,
                playerB VARCHAR(255) NOT NULL,
                result VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failure create table" },
      { status: 500 },
    );
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
        scoreA = 1;
        break;
      case "winB":
        scoreA = 0;
        break;
      case "draw":
        scoreA = 0.5;
        break;
    }

    const newRatingA = computeElo(ratingA, ratingB, scoreA);
    const newRatingB = computeElo(ratingB, ratingA, 1 - scoreA);

    // Update ratings in the database
    await pool.query("UPDATE players SET rating = $1 WHERE name = $2", [
      newRatingA,
      playerA,
    ]);
    await pool.query("UPDATE players SET rating = $1 WHERE name = $2", [
      newRatingB,
      playerB,
    ]);

    // Add the match result to a separate table (if you have one)
    await pool.query(
      "INSERT INTO matches (playerA, playerB, result) VALUES ($1, $2, $3)",
      [playerA, playerB, result],
    );

    await pool.query("COMMIT"); // 트랜잭션 커밋

    return NextResponse.json({
      playerA: { name: playerA, newRating: newRatingA },
      playerB: { name: playerB, newRating: newRatingB },
    });
  } catch (error) {
    await pool.query("ROLLBACK"); // 에러가 발생하면 롤백
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
