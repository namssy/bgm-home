"use client";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Inter } from "next/font/google";
import Link from "next/link";

import { usePathname } from "next/navigation";
import classNames from "classnames";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const inter = Inter({ subsets: ["latin"] });

const navigation = [
  { name: "Add Match", href: "/chess/add_match" },
  { name: "Leader Board", href: "/chess/leaderboard" },
  { name: "Log", href: "/chess/log" },
];

//https://tailwindui.com/components/application-ui/application-shells/stacked

export default function ChessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  console.log("pathname ", pathname);

  return (
    <html lang="en">
      <body
        className={`${inter.className} h-screen bg-gray-100 dark:bg-gray-900`}
      >
        <div className="min-h-full flex flex-col">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">BGM Chess</div>
                      <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.href === pathname
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium",
                              )}
                              aria-current={
                                item.href === pathname ? "page" : undefined
                              }
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="md:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.href === pathname
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium",
                        )}
                        aria-current={
                          item.href === pathname ? "page" : undefined
                        }
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <main className="flex-grow">
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex flex-col justify-center items-center align-middle">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
