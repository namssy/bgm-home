"use client";
import { useState, useEffect } from "react";
import { ChessPlayer } from "@/types/chess";

export default function Leaderboard() {
  const [playersByScore, setPlayersByScore] = useState<ChessPlayer[]>([]);
  const [playersByRating, setPlayersByRating] = useState<ChessPlayer[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch("/chess/api/players", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as ChessPlayer[];

      if (response.ok) {
        setPlayersByScore(data.sort((a, b) => b.score - a.score));
        setPlayersByRating(data.sort((a, b) => b.rating - a.rating));
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Chess Leaderboard
      </h1>
      <h2 className="text-2xl font-semibold mb-4">By Score</h2>
      <table className="bg-white p-6 rounded shadow-md w-full sm:max-w-md mb-8 overflow-x-auto">
        <thead>
          <tr>
            <th className="text-center">Name</th>
            <th className="text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          {playersByScore.map((player, index) => (
            <tr key={index}>
              <td className="text-center">{player.name}</td>
              <td className="text-center">{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mb-4">By Rating</h2>
      <table className="bg-white p-6 rounded shadow-md w-full sm:max-w-md overflow-x-auto">
        <thead>
          <tr>
            <th className="text-center">Name</th>
            <th className="text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
          {playersByRating.map((player, index) => (
            <tr key={index}>
              <td className="text-center">{player.name}</td>
              <td className="text-center">{player.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
