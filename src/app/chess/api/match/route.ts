import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ChessMatchResult } from "@/types/chess";
import { PrismaClient } from "@prisma/client";

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
  client: Pick<PrismaClient, "chessPlayers">,
  playerName: string,
) {
  const player = await client.chessPlayers.findUnique({
    where: { name: playerName },
  });

  if (player) {
    console.log("find player", playerName);
    return player;
  }

  return client.chessPlayers
    .create({
      data: {
        name: playerName,
      },
    })
    .then((player) => {
      console.log("create player", playerName);
      return player;
    });
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
    const transaction = await prisma.$transaction(async (tx) => {
      const [playerWhite, playerBlack] = await Promise.all([
        createPlayerIfNotExist(tx, playerA),
        createPlayerIfNotExist(tx, playerB),
      ]);

      if (!playerWhite || !playerBlack) {
        throw new Error("Player not found");
      }

      const ratingA = playerWhite.rating;
      const ratingB = playerBlack.rating;

      const [scoreA, diff] = getRatingDiff({ result, ratingA, ratingB });
      const scoreB = 2 - scoreA;
      return Promise.all([
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
    return NextResponse.json(transaction);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
export const dynamic = "force-dynamic";
