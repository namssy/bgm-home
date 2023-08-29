import prisma from "@/lib/prisma";
import { ChessMatches } from ".prisma/client";
import { ChessLogs } from "@/types/chess";
import { ChessMatchResult } from "@/types/chess";

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

export const getLogs = async (): Promise<ChessLogs[]> => {
  "use server";
  try {
    const data = await prisma.chessMatches.findMany({
      include: {
        player_white: { include: { user: true } },
        player_black: { include: { user: true } },
      },
      orderBy: [{ timestamp: "desc" }],
    });
    return data.map(
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
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getScore = (result: ChessMatchResult) => {
  switch (result) {
    case "winA":
      return 2;
    case "winB":
      return 0;
    case "draw":
      return 1;
  }
};
