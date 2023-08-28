"use client";
import classNames from "classnames";
import { ChessMatches } from ".prisma/client";
import { ChessLogs, ChessMatchResult } from "@/types/chess";
import { Avatar, Table } from "flowbite-react";

const RESULT: Record<ChessMatchResult, string> = {
  winA: "White won",
  winB: "Black won",
  draw: "Draw",
};

const DeltaRating = ({ value }: { value: number }) => {
  return (
    <span
      className={classNames(value >= 0 ? "text-green-500" : "text-red-600")}
    >
      {value}
    </span>
  );
};

const LogContainer = ({ logs }: { logs: ChessLogs[] }) => {
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
    </>
  );
};

export default LogContainer;
