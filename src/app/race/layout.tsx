"use client";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Inter } from "next/font/google";
import "flowbite";

const inter = Inter({ subsets: ["latin"] });

export default function ChessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        <div className="min-h-full flex flex-col bg-gray-100 dark:bg-gray-900">
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
