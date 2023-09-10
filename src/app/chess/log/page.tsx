import LogContainer from "@/components/log/LogContainer";
import { getLogs } from "@/utiles/match";

export const dynamic = "force-dynamic";
export default async function MatchLog({
  searchParams,
}: {
  searchParams: { p: string };
}) {
  const pageNo: number = parseInt(searchParams.p ?? "1") ?? 1;
  const { data, count } = await getLogs({
    pageNo,
  });
  return <LogContainer logs={data} pageNo={pageNo} total={count} />;
}
