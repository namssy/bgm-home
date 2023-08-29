import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ChessLogs } from "@/types/chess";
import { getScore } from "@/utiles/match";

export async function POST(req: Request) {
  const { log } = (await req.json()) as {
    log: ChessLogs;
  };

  const playerA = log.white.name;
  const playerB = log.black.name;
  const diff = log.diff;
  const result = log.result;

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
        throw "Error";
      }
      if (!players.some((p) => p.name === playerB)) {
        throw "Error";
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
      const scoreA = getScore(result);
      const scoreB = 2 - scoreA;

      await prisma.chessPlayers.update({
        where: {
          name: playerA,
        },
        data: {
          rating: ratingA - diff,
          score: {
            decrement: scoreA,
          },
        },
      });

      await prisma.chessPlayers.update({
        where: {
          name: playerB,
        },
        data: {
          rating: ratingB + diff,
          score: {
            decrement: scoreB,
          },
        },
      });

      await prisma.chessMatches.delete({
        where: {
          player_white_id: playerWhite.player_id,
          player_black_id: playerBlack.player_id,
          result: result,
          diff: diff,
          match_id: 123 // how can I get this value?
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
