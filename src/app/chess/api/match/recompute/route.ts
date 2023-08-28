import { NextResponse } from "next/server";

export async function POST() {
  // TODO: 인증된 사용자만 접근할 수 있도록 수정
  return NextResponse.json({ error: "Access denied" }, { status: 500 });
  //
  // try {
  //   await prisma.$transaction(async (prisma) => {
  //     await prisma.chessPlayers.updateMany({
  //       data: {
  //         rating: 1200,
  //         score: 0,
  //       },
  //     });
  //
  //     const matches = await prisma.chessMatches.findMany({
  //       orderBy: {
  //         timestamp: "asc",
  //       },
  //     });
  //
  //     for (const match of matches) {
  //       const { result, player_white_id, player_black_id, match_id } = match;
  //       const players = await prisma.chessPlayers.findMany({
  //         where: {
  //           player_id: {
  //             in: [player_white_id, player_black_id],
  //           },
  //         },
  //       });
  //
  //       const ratingA =
  //         players.find((p) => p.name === player_a)?.rating ?? 1200;
  //       const ratingB =
  //         players.find((p) => p.name === player_b)?.rating ?? 1200;
  //
  //       const [scoreA, diff] = getRatingDiff({ result, ratingA, ratingB });
  //       const scoreB = 2 - scoreA;
  //
  //       // Update ratings in the database
  //       await prisma.chessPlayers.updateMany({
  //         where: {
  //           name: player_a,
  //         },
  //         data: {
  //           rating: ratingA + diff,
  //           score: {
  //             increment: scoreA,
  //           },
  //         },
  //       });
  //
  //       await prisma.chessPlayers.updateMany({
  //         where: {
  //           name: player_b,
  //         },
  //         data: {
  //           rating: ratingB - diff,
  //           score: {
  //             increment: scoreB,
  //           },
  //         },
  //       });
  //
  //       await prisma.chessMatches.update({
  //         where: {
  //           match_id: match_id,
  //         },
  //         data: {
  //           diff: diff,
  //         },
  //       });
  //     }
  //   });
  //
  //   return NextResponse.json("");
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json(
  //     { error: "Internal server error" },
  //     { status: 500 },
  //   );
  // }
}
