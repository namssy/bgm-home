"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { PropsWithChildren } from "react";

type Props = { session: Session | null };

export default function AuthContext({
  session,
  children,
}: Props & PropsWithChildren) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
