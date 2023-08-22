"use client";
import { ChessPlayer } from "@/types/chess";

export default function LeaderboardContainer({
  playersByScore,
  playersByRating,
}: {
  playersByScore: ChessPlayer[];
  playersByRating: ChessPlayer[];
}) {
  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-center">Leader Board</h1>
      <div className="flex sm:flex-row flex-col gap-1.5">
        <div>
          <h2 className="text-2xl font-semibold mb-4">By Score</h2>
          <div className="relative overflow-x-auto rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-center">Name</th>
                  <th className="px-6 py-3 text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {playersByScore.map((player, index) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    key={index}
                  >
                    <td className="px-6 py-3 text-center">{player.name}</td>
                    <td className="px-6 py-3 text-center">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">By Rating</h2>
          <div className="relative overflow-x-auto rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-center">Name</th>
                  <th className="px-6 py-3 text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {playersByRating.map((player, index) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    key={index}
                  >
                    <td className="px-6 py-3 text-center">{player.name}</td>
                    <td className="px-6 py-3 text-center">{player.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
