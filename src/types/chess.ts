import { $Enums } from ".prisma/client";

export type ChessPlayer = {
  player_id: number;
  name: string;
  rating: number;
  score: number;
  created_at: Date | null;
  updated_at: Date | null;
};

export type ChessMatchResult = $Enums.match_result;

export interface ChessMatch {
  match_id: number;
  player_a: string;
  player_b: string;
  result: ChessMatchResult;
  timestamp: Date | null;
  diff: number;
}
