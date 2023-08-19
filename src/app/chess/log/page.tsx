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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Match Results Log</h1>
      <table className="bg-white p-6 rounded shadow-md w-96">
        <thead>
          <tr>
            <th>Player A</th>
            <th>Player B</th>
            <th>Result</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index}>
              <td>{match.player_a}</td>
              <td>{match.player_b}</td>
              <td>{match.result}</td>
              <td>{new Date(match.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
