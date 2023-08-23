'use client'
import { ChessMatch, ChessMatchResult } from "@/types/chess";

const RESULT: Record<ChessMatchResult, string> = {
  winA: "White won",
  winB: "Black won",
  draw: "Draw",
};

const LogContainer = ({ matches }: { matches: ChessMatch[] }) => {
  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Match Results Log
      </h1>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-center">White</th>
              <th className="px-6 py-3 text-center">Black</th>
              <th className="px-6 py-3 text-center">Result</th>
              <th className="px-6 py-3 hidden sm:table-cell text-center">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4text-center">{match.player_a}</td>
                <td className="px-6 py-4text-center">{match.player_b}</td>
                <td className="px-6 py-4text-center">{RESULT[match.result]}</td>
                <td className="px-6 py-4 hidden sm:table-cell text-center">
                  {new Date(match.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LogContainer;
