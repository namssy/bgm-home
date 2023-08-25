import { NextResponse } from "next/server";
import { ChessMatchResult } from "@/types/chess";
import { getMatch } from "@/utiles/match";

function computeElo(ratingA: number, ratingB: number, scoreA: number): number {
  const k = 32;
  const expectedScoreA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  return ratingA + k * (scoreA - expectedScoreA);
}

const getScore = (result: ChessMatchResult) => {
  switch (result) {
    case "winA":
      return 2;
    case "winB":
      return 0;
    case "draw":
      return 1;
  }
};

export const getRatingDiff = ({
  result,
  ratingA,
  ratingB,
}: {
  result: ChessMatchResult;
  ratingA: number;
  ratingB: number;
}) => {
  const scoreA = getScore(result);
  const newRatingA = computeElo(ratingA, ratingB, scoreA / 2);
  return [scoreA, newRatingA - ratingA];
};

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
    await prisma.$transaction(async (prisma) => {
      const players = await prisma.players.findMany({
        where: {
          name: {
            in: [playerA, playerB],
          },
        },
      });

      if (!players.some((p) => p.name === playerA)) {
        await prisma.players.create({
          data: {
            name: playerA,
          },
        });
      }

      if (!players.some((p) => p.name === playerB)) {
        await prisma.players.create({
          data: {
            name: playerB,
          },
        });
      }

      const ratingA = players.find((p) => p.name === playerA)?.rating ?? 1200;
      const ratingB = players.find((p) => p.name === playerB)?.rating ?? 1200;

      const [scoreA, diff] = getRatingDiff({ result, ratingA, ratingB });
      const scoreB = 2 - scoreA;

      await prisma.players.update({
        where: {
          name: playerA,
        },
        data: {
          rating: ratingA + diff,
          score: {
            increment: scoreA,
          },
        },
      });

      await prisma.players.update({
        where: {
          name: playerB,
        },
        data: {
          rating: ratingB - diff,
          score: {
            increment: scoreB,
          },
        },
      });

      await prisma.matches.create({
        data: {
          player_a: playerA,
          player_b: playerB,
          result: result,
          diff: diff,
        },
      });
    });

    return NextResponse.json("");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const matches = getMatch();
    return NextResponse.json({ matches });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
