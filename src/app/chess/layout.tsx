import React, { PropsWithChildren } from "react";
import ChessLayoutView from "@/components/layout/ChessLayoutView";
import { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "BGM Chess",
  description: "BGM Chess leaderboards",
};

export default async function ChessLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <ChessLayoutView session={session}>{children}</ChessLayoutView>
    </html>
  );
}
