import { ChessPlayer } from "@/types/chess";
import prisma from "@/lib/prisma";

export const getPlayers = async (): Promise<ChessPlayer[]> => {
  "use server";
  try {
    const players = await prisma.players.findMany();
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
