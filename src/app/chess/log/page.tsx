"use client";
import { useState, useEffect } from "react";

export default function MatchLog() {
  const [matches, setMatches] = useState<
    { player_a: string; player_b: string; result: string; timestamp: string }[]
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
    <div className="flex flex-col justify-center items-center bg-gray-100 px-4 sm:px-0">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Match Results Log
      </h1>
      <table className="bg-white p-6 rounded shadow-md w-full sm:max-w-2xl overflow-x-auto">
        <thead>
          <tr>
            <th className="text-center">Player A</th>
            <th className="text-center">Player B</th>
            <th className="text-center">Result</th>
            <th className="hidden sm:table-cell text-center">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index}>
              <td className="text-center">{match.player_a}</td>
              <td className="text-center">{match.player_b}</td>
              <td className="text-center">{match.result}</td>
              <td className="hidden sm:table-cell text-center">
                {new Date(match.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
