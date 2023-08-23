export type ChessPlayer = {
  name: string;
  score: number;
  rating: number;
};

export type ChessMatchResult = "winA" | "winB" | "draw";

export interface ChessMatch {
  match_id: number;
  player_a: string;
  player_b: string;
  result: ChessMatchResult;
  timestamp: string;
  diff: number;
}
