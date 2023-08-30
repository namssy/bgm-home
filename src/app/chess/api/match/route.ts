import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ChessMatchResult } from "@/types/chess";
import { getMatch } from "@/utiles/match";
import { ChessPlayers } from ".prisma/client";

const K_FACTOR = 32;
const SCORES = {
  winA: 2,
  winB: 0,
  draw: 1,
};

function computeElo(ratingA: number, ratingB: number, scoreA: number): number {
  const expectedScoreA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  return ratingA + K_FACTOR * (scoreA - expectedScoreA);
}

const getScore = (result: ChessMatchResult) => SCORES[result];

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

async function createPlayerIfNotExist(
  playerName: string,
  existingPlayers: ChessPlayers[],
) {
  if (!existingPlayers.some((p) => p.name === playerName)) {
    await prisma.chessPlayers.create({
      data: {
        name: playerName,
      },
    });
  }
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

  const existingPlayers = await prisma.chessPlayers.findMany({
    where: {
      name: {
        in: [playerA, playerB],
      },
    },
  });

  await Promise.all([
    createPlayerIfNotExist(playerA, existingPlayers),
    createPlayerIfNotExist(playerB, existingPlayers),
  ]);

  try {
    await prisma.$transaction(async (tx) => {
      const [playerWhite, playerBlack] = await Promise.all([
        tx.chessPlayers.findUnique({
          where: {
            name: playerA,
          },
        }),
        tx.chessPlayers.findUnique({
          where: {
            name: playerB,
          },
        }),
      ]);

      if (!playerWhite || !playerBlack) {
        throw new Error("Player not found");
      }

      const ratingA = playerWhite.rating;
      const ratingB = playerBlack.rating;

      const [scoreA, diff] = getRatingDiff({ result, ratingA, ratingB });
      const scoreB = 2 - scoreA;
      await Promise.all([
        tx.chessPlayers.update({
          where: {
            name: playerA,
          },
          data: {
            rating: ratingA + diff,
            score: {
              increment: scoreA,
            },
          },
        }),
        tx.chessPlayers.update({
          where: {
            name: playerB,
          },
          data: {
            rating: ratingB - diff,
            score: {
              increment: scoreB,
            },
          },
        }),
        tx.chessMatches.create({
          data: {
            player_white_id: playerWhite.player_id,
            player_black_id: playerBlack.player_id,
            result: result,
            diff: diff,
          },
        }),
      ]);
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
    const matches = await getMatch();
    return NextResponse.json({ matches });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
