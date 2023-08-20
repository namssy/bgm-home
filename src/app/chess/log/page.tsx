"use client";
import { useState, useEffect } from "react";
import { ChessMatchResult } from "@/types/chess";

const RESULT: Record<ChessMatchResult, string> = {
  winA: "White won",
  winB: "Black won",
  draw: "Draw",
};

export default function MatchLog() {
  const [matches, setMatches] = useState<
    {
      player_a: string;
      player_b: string;
      result: ChessMatchResult;
      timestamp: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const response = await fetch("/chess/api/match", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMatches(data.matches);
      } else {
        console.error(data.error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Match Results Log
      </h1>
      <table className="bg-white p-6 rounded shadow-md w-full sm:max-w-2xl overflow-x-auto">
        <thead>
          <tr>
            <th className="text-center">White</th>
            <th className="text-center">Black</th>
            <th className="text-center">Result</th>
            <th className="hidden sm:table-cell text-center">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index}>
              <td className="text-center">{match.player_a}</td>
              <td className="text-center">{match.player_b}</td>
              <td className="text-center">{RESULT[match.result]}</td>
              <td className="hidden sm:table-cell text-center">
                {new Date(match.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
