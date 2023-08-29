import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ChessMatchResult } from "@/types/chess";
import { getMatch, getScore } from "@/utiles/match";

function computeElo(ratingA: number, ratingB: number, scoreA: number): number {
  const k = 32;
  const expectedScoreA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  return ratingA + k * (scoreA - expectedScoreA);
}

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
      const players = await prisma.chessPlayers.findMany({
        where: {
          name: {
            in: [playerA, playerB],
          },
        },
      });

      if (!players.some((p) => p.name === playerA)) {
        await prisma.chessPlayers.create({
          data: {
            name: playerA,
          },
        });
      }

      if (!players.some((p) => p.name === playerB)) {
        await prisma.chessPlayers.create({
          data: {
            name: playerB,
          },
        });
      }

      const playerWhite = await prisma.chessPlayers.findUnique({
        where: {
          name: playerA,
        },
      });
      const playerBlack = await prisma.chessPlayers.findUnique({
        where: {
          name: playerB,
        },
      });

      if (!playerWhite || !playerBlack) {
        throw "Error";
      }

      const ratingA = playerWhite.rating;
      const ratingB = playerBlack.rating;

      const [scoreA, diff] = getRatingDiff({ result, ratingA, ratingB });
      const scoreB = 2 - scoreA;

      await prisma.chessPlayers.update({
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

      await prisma.chessPlayers.update({
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

      await prisma.chessMatches.create({
        data: {
          player_white_id: playerWhite.player_id,
          player_black_id: playerBlack.player_id,
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
