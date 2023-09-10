import prisma from "@/lib/prisma";
import { ChessMatches } from ".prisma/client";
import { ChessLogs } from "@/types/chess";

export const getMatch = async (): Promise<ChessMatches[]> => {
  "use server";
  try {
    return await prisma.chessMatches.findMany({
      orderBy: [{ timestamp: "desc" }],
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getLogs = async (options?: {
  pageNo?: number;
}): Promise<{ data: ChessLogs[]; count: number }> => {
  "use server";
  const pageNo = options?.pageNo ?? 1;
  try {
    const [data, count] = await Promise.all([
      prisma.chessMatches.findMany({
        select: {
          diff: true,
          result: true,
          timestamp: true,
          player_white: {
            select: { name: true, user: { select: { image: true } } },
          },
          player_black: {
            select: { name: true, user: { select: { image: true } } },
          },
        },
        skip: 10 * (pageNo - 1),
        take: 10,
        orderBy: [{ timestamp: "desc" }],
      }),
      prisma.chessMatches.count(),
    ]);

    return {
      data: data.map(
        ({ player_white, player_black, diff, result, timestamp }) => {
          return {
            white: {
              name: player_white.name,
              image: player_white.user?.image ?? null,
            },
            black: {
              name: player_black.name,
              image: player_black.user?.image ?? null,
            },
            diff,
            result,
            timestamp,
          };
        },
      ),
      count,
    };
  } catch (error) {
    console.error(error);
    return { data: [], count: 0 };
  }
};
