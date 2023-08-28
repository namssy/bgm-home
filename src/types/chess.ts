import { $Enums, ChessMatches } from ".prisma/client";

export type ChessMatchResult = $Enums.match_result;
export interface ChessLogs {
  white: { name: string; image: string | null };
  black: { name: string; image: string | null };
  diff: number;
  result: ChessMatchResult;
  timestamp: Date | null;
}
