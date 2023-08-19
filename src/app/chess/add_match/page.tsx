"use client";
import { useState } from "react";

export default function AddMatch() {
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [result, setResult] = useState("");

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
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Add Match Result</h1>
      <form
        className="bg-white p-6 rounded shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="playerA">
            Player A:
          </label>
          <input
            type="text"
            id="playerA"
            value={playerA}
            onChange={(e) => setPlayerA(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="playerB">
            Player B:
          </label>
          <input
            type="text"
            id="playerB"
            value={playerB}
            onChange={(e) => setPlayerB(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="result">
            Result:
          </label>
          <select
            id="result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select result</option>
            <option value="winA">Player A won</option>
            <option value="winB">Player B won</option>
            <option value="draw">Draw</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Match
        </button>
      </form>
    </div>
  );
}
