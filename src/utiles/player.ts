import prisma from "@/lib/prisma";
import { ChessPlayers, User } from ".prisma/client";

export const getPlayers = async (): Promise<
  (ChessPlayers & { user: User | null })[]
> => {
  "use server";
  try {
    const players = await prisma.chessPlayers.findMany({
      include: {
        user: true,
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
