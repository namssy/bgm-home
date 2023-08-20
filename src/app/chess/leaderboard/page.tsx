import LeaderboardContainer from "@/components/leaderboard/LeaderboardContainer";
import { getPlayers } from "@/utiles/player";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

export default async function Leaderboard() {
  const players = await getPlayers();
  return (
    <LeaderboardContainer
      playersByScore={players.sort((a, b) => b.score - a.score)}
      playersByRating={players.sort((a, b) => b.rating - a.rating)}
    />
  );
}
