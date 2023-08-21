import "react-bootstrap-typeahead/css/Typeahead.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function ChessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <header className="sticky bg-gray-800 text-white py-4 px-6">
          <nav className="flex flex-wrap justify-between">
            <div className="w-full md:w-auto">
              <div className="text-2xl font-semibold">Chess</div>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0 flex justify-between md:space-x-5">
              <Link className="hover:text-gray-400" href={"/chess/add_match"}>
                Add Match
              </Link>
              <a className="hover:text-gray-400" href={"/chess/leaderboard"}>
                Leaderboard
              </a>
              <a className="hover:text-gray-400" href={"/chess/log"}>
                Logs
              </a>
            </div>
          </nav>
        </header>
        <main className="w-screen overflow-y-auto flex md:h-[calc(100vh_-_64px)] h-[calc(100vh_-_104px)]">
          <div className="w-full flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-800 px-4 sm:px-0">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
