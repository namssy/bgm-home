"use client";
import * as React from "react";
import { PropsWithChildren, ReactElement } from "react";
import AuthContext from "@/context/AuthContext";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Inter } from "next/font/google";

import "react-bootstrap-typeahead/css/Typeahead.css";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

const navigation = [
  { name: "Leader Board", href: "/chess/leaderboard" },
  { name: "Add Match", href: "/chess/add_match" },
  { name: "Log", href: "/chess/log" },
];

// https://www.flowbite-react.com/

const Profile = () => {
  const { data: session, status } = useSession();
  if (!session || !session.user) {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }

  const { image, email, name } = session.user;
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={<Avatar alt="User settings" img={image ?? ""} rounded />}
    >
      <Dropdown.Header>
        <span className="block text-sm">{name}</span>
        <span className="block truncate text-sm font-medium">{email}</span>
      </Dropdown.Header>
      <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
      {/*<Dropdown.Divider />*/}
    </Dropdown>
  );
};

const ChessLayoutView = ({
  session,
  children,
}: { session: Session | null } & PropsWithChildren): ReactElement => {
  const pathname = usePathname();
  return (
    <body className={`${inter.className} h-screen`}>
      <AuthContext session={session}>
        <Navbar fluid>
          <Navbar.Brand>BGM Chess</Navbar.Brand>
          <div className="flex md:order-2">
            <Profile />
            <Navbar.Toggle />
          </div>
          <Navbar.Collapse>
            {navigation.map(({ name, href }) => {
              return (
                <Navbar.Link key={href} active={href === pathname} href={href}>
                  {name}
                </Navbar.Link>
              );
            })}
          </Navbar.Collapse>
        </Navbar>
        <main className="flex-grow">
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-col justify-center items-center align-middle">
            {children}
          </div>
        </main>
      </AuthContext>
    </body>
  );
};

export default ChessLayoutView;
