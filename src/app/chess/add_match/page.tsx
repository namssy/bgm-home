"use client";
import { useEffect, useState } from "react";
import { ChessPlayer } from "@/types/chess";
import AutoSuggestInput from "@/components/AutoSuggestInput";

export default function AddMatch() {
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [result, setResult] = useState("");

  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch("/chess/api/players");
      const data = (await response.json()) as ChessPlayer[];
      setPlayers(data.map(({ name }) => name));
    };

    fetchPlayers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("/chess/api/match");

    const response = await fetch("/chess/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerA, playerB, result }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Match added successfully!");
      setPlayerA("");
      setPlayerB("");
      setResult("");
    } else {
      alert(data.error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Add Match Result
      </h1>
      <form className="p-6 w-full sm:max-w-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-md font-bold mb-2" htmlFor="playerA">
            White <span className="pl-1 pr-1 text-white bg-black">♞</span>:
          </label>
          <AutoSuggestInput
            id="playerA"
            type="text"
            list={players}
            autoComplete="off"
            required
            onChange={setPlayerA}
            value={playerA}
          />
        </div>
        <div className="mb-4">
          <label className="block text-md font-bold mb-2" htmlFor="playerB">
            Black <span className="pl-1 pr-1 text-black bg-white">♞</span>:
          </label>
          <AutoSuggestInput
            type="player"
            id="playerB"
            list={players}
            value={playerB}
            onChange={setPlayerB}
            autoComplete="off"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-md font-bold mb-2" htmlFor="result">
            Result:
          </label>
          <select
            id="result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option disabled value="">
              Select result
            </option>
            <option value="winA">White won</option>
            <option value="winB">Black won</option>
            <option value="draw">Draw</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Add Match
        </button>
      </form>
    </>
  );
}
