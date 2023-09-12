"use client";
import classNames from "classnames";
import { ChessLogs, ChessMatchResult } from "@/types/chess";
import { Avatar, Pagination, Table } from "flowbite-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const RESULT: Record<ChessMatchResult, string> = {
  winA: "White won",
  winB: "Black won",
  draw: "Draw",
};

const PAGE_SIZE = 10;

const DeltaRating = ({ value }: { value: number }) => {
  return (
    <span
      className={classNames(value >= 0 ? "text-green-500" : "text-red-600")}
    >
      {value}
    </span>
  );
};

const LogContainer = ({
  logs,
  pageNo,
  total,
}: {
  logs: ChessLogs[];
  pageNo: number;
  total: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const changePage = (page: number) => {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
    current.set("p", (page ?? "1").toString());
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Match Results Log
      </h1>

      <div className="relative overflow-x-auto sm:rounded-lg">
        <Table>
          <Table.Head>
            <Table.HeadCell className="text-center">White</Table.HeadCell>
            <Table.HeadCell className="text-center">Black</Table.HeadCell>
            <Table.HeadCell className="text-center">Result</Table.HeadCell>
            <Table.HeadCell className="text-center hidden sm:table-cell">
              Timestamp
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {logs.map(({ black, white, diff, result, timestamp }, index) => (
              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Avatar
                      alt="User settings"
                      size={"xs"}
                      rounded
                      img={white.image ?? undefined}
                    />
                    <div>
                      {white.name}(
                      <DeltaRating value={Math.round(diff)} />)
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Avatar
                      alt="User settings"
                      size={"xs"}
                      rounded
                      img={black.image ?? undefined}
                    />
                    <div>
                      {black.name}(
                      <DeltaRating value={Math.round(-diff)} />)
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-center">
                  {RESULT[result]}
                </Table.Cell>
                <Table.Cell className="hidden sm:table-cell text-center">
                  {timestamp ? new Date(timestamp).toLocaleString() : "-"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Pagination
        currentPage={pageNo}
        showIcons
        layout="navigation"
        onPageChange={changePage}
        totalPages={totalPages}
      />
    </>
  );
};

export default LogContainer;
