"use client";

import { ChessPlayers, User } from ".prisma/client";
import { Avatar, Table } from "flowbite-react";

export default function LeaderboardContainer({
  playersByScore,
  playersByRating,
}: {
  playersByScore: (ChessPlayers & { user: User | null })[];
  playersByRating: (ChessPlayers & { user: User | null })[];
}) {
  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-center">Leader Board</h1>
      <div className="flex sm:flex-row flex-col gap-1.5">
        <div>
          <h2 className="text-2xl font-semibold mb-4">By Score</h2>
          <div className="relative overflow-x-auto rounded-lg">
            <Table>
              <Table.Head>
                <Table.HeadCell className="text-center">Name</Table.HeadCell>
                <Table.HeadCell className="text-center">Score</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {playersByScore.map((player, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="flex flex-wrap gap-2 items-center">
                      <Avatar
                        alt="User settings"
                        size={"xs"}
                        rounded
                        img={player.user?.image ?? undefined}
                      />
                      <div>{player.name}</div>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {player.score}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">By Rating</h2>
          <div className="relative overflow-x-auto rounded-lg">
            <Table>
              <Table.Head>
                <Table.HeadCell className="text-center">Name</Table.HeadCell>
                <Table.HeadCell className="text-center">Score</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {playersByRating.map((player, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="flex flex-wrap gap-3 items-center">
                      <Avatar
                        alt="User settings"
                        size={"xs"}
                        rounded
                        img={player.user?.image ?? undefined}
                      />
                      <div>{player.name}</div>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {player.rating}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
