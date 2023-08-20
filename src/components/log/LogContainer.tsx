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
};

export default LogContainer;
