"use client";

import { ChessPlayers, User } from ".prisma/client";
import { Avatar, Pagination, Table } from "flowbite-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 10;
export default function LeaderboardContainer({
  playersByScore,
  playersByRating,
  pageNo,
  total,
}: {
  playersByScore: (Pick<ChessPlayers, "name" | "score"> & {
    user: Pick<User, "image"> | null;
  })[];
  playersByRating: (Pick<ChessPlayers, "name" | "rating"> & {
    user: Pick<User, "image"> | null;
  })[];
  pageNo: number;
  total: number;
}) {
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
      <h1 className="text-3xl font-semibold mb-6 text-center">Leader Board</h1>
      <Pagination
        currentPage={pageNo}
        showIcons
        layout="navigation"
        onPageChange={changePage}
        totalPages={totalPages}
      />
      <div className="flex sm:flex-row flex-col gap-1.5">
        <div>
          <h2 className="text-2xl font-semibold mb-4">By Score</h2>
          <div className="relative overflow-x-auto rounded-lg ">
            <Table>
              <Table.Head>
                <Table.HeadCell className="text-center">No.</Table.HeadCell>
                <Table.HeadCell className="text-center">Name</Table.HeadCell>
                <Table.HeadCell className="text-center">Score</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {playersByScore.map((player, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="text-center">
                      {index + 1 + (pageNo - 1) * PAGE_SIZE}
                    </Table.Cell>
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
                <Table.HeadCell className="text-center">No.</Table.HeadCell>
                <Table.HeadCell className="text-center">Name</Table.HeadCell>
                <Table.HeadCell className="text-center">Rating</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {playersByRating.map((player, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="text-center">
                      {index + 1 + (pageNo - 1) * PAGE_SIZE}
                    </Table.Cell>
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
