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

export const getPlayers = async (): Promise<
  (Pick<ChessPlayers, "name" | "score" | "rating"> & {
    user: Pick<User, "image"> | null;
  })[]
> => {
  "use server";
  try {
    const players = await prisma.chessPlayers.findMany({
      select: {
        name: true,
        score: true,
        rating: true,
        user: { select: { image: true } },
      },
    });
    return players.map(({ score, rating, ...rest }) => {
      return {
        score: score / 2,
        rating: Math.round(rating),
        ...rest,
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
