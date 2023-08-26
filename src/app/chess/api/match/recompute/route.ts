import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getRatingDiff } from "@/app/chess/api/match/route";

export async function POST() {
  // TODO: 인증된 사용자만 접근할 수 있도록 수정
  return NextResponse.json({ error: "Access denied" }, { status: 500 });

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.players.updateMany({
        data: {
          rating: 1200,
          score: 0,
        },
      });

      const matches = await prisma.matches.findMany({
        orderBy: {
          timestamp: "asc",
        },
      });

      for (const match of matches) {
        const { result, player_a, player_b, match_id } = match;
        const players = await prisma.players.findMany({
          where: {
            name: {
              in: [player_a, player_b],
            },
          },
        });

        const ratingA =
          players.find((p) => p.name === player_a)?.rating ?? 1200;
        const ratingB =
          players.find((p) => p.name === player_b)?.rating ?? 1200;

        const [scoreA, diff] = getRatingDiff({ result, ratingA, ratingB });
        const scoreB = 2 - scoreA;

        // Update ratings in the database
        await prisma.players.updateMany({
          where: {
            name: player_a,
          },
          data: {
            rating: ratingA + diff,
            score: {
              increment: scoreA,
            },
          },
        });

        await prisma.players.updateMany({
          where: {
            name: player_b,
          },
          data: {
            rating: ratingB - diff,
            score: {
              increment: scoreB,
            },
          },
        });

        await prisma.matches.update({
          where: {
            match_id: match_id,
          },
          data: {
            diff: diff,
          },
        });
      }
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
