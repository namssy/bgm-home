import LogContainer from "@/components/log/LogContainer";
import { getLogs } from "@/utiles/match";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

export default async function MatchLog() {
  const logs = await getLogs();
  return <LogContainer logs={logs} />;
}
