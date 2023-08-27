import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BGM Home",
  description: "Board Game Mania",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html lang="en">{children}</html>;
}
