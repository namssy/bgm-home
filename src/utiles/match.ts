import "server-only";
import { ChessMatch } from "@/types/chess";

export const getMatch = async (): Promise<ChessMatch[]> => {
  "use server";
  try {
    return await prisma.matches.findMany({
      orderBy: [{ timestamp: "desc" }],
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
