import prisma from "@/lib/prisma";
import { ChessPlayers, User } from ".prisma/client";

export const getPlayerNames = async (): Promise<
  Pick<ChessPlayers, "name">[]
> => {
  "use server";
  try {
    return prisma.chessPlayers.findMany({
      select: {
        name: true,
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getLeaderboardPlayerList = async (options?: {
  pageNo?: number;
}): Promise<{
  score: (Pick<ChessPlayers, "name" | "score"> & {
    user: Pick<User, "image"> | null;
  })[];
  rating: (Pick<ChessPlayers, "name" | "rating"> & {
    user: Pick<User, "image"> | null;
  })[];
  count: number;
}> => {
  "use server";
  const pageNo = options?.pageNo ?? 1;
  try {
    const [score, rating, count] = await Promise.all([
      prisma.chessPlayers
        .findMany({
          select: {
            name: true,
            score: true,
            user: {
              select: {
                image: true,
              },
            },
          },
          skip: 10 * (pageNo - 1),
          take: 10,
          orderBy: [{ score: "desc" }],
        })
        .then((players) =>
          players.map(({ score, ...rest }) => ({
            score: score / 2,
            ...rest,
          })),
        ),
      prisma.chessPlayers
        .findMany({
          select: {
            name: true,
            rating: true,
            user: {
              select: {
                image: true,
              },
            },
          },
          skip: 10 * (pageNo - 1),
          take: 10,
          orderBy: [{ rating: "desc" }],
        })
        .then((players) =>
          players.map(({ rating, ...rest }) => ({
            rating: Math.round(rating),
            ...rest,
          })),
        ),
      prisma.chessPlayers.count(),
    ]);
    return {
      score,
      rating,
      count,
    };
  } catch (error) {
    console.error(error);
    return { score: [], rating: [], count: 0 };
  }
};
