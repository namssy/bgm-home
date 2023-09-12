import LeaderboardContainer from "@/components/leaderboard/LeaderboardContainer";
import { getLeaderboardPlayerList } from "@/utiles/player";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

export default async function Leaderboard({
  searchParams,
}: {
  searchParams: { p: string };
}) {
  const pageNo: number = parseInt(searchParams.p ?? "1") ?? 1;

  const { score, rating, count } = await getLeaderboardPlayerList({ pageNo });

  return (
    <LeaderboardContainer
      playersByScore={score}
      playersByRating={rating}
      pageNo={pageNo}
      total={count}
    />
  );
}
