export type ChessPlayer = {
  name: string;
  score: number;
  rating: number;
};

export type ChessMatchResult = "winA" | "winB" | "draw";

export interface ChessMatch {
  player_a: string;
  player_b: string;
  result: ChessMatchResult;
  timestamp: string;
  diff: number;
}
