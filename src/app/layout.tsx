import "./globals.css";
import type {Metadata, Viewport} from "next";

export const metadata: Metadata = {
  title: "BGM Home",
  description: "Board Game Mania",
};

export const viewport: Viewport = {
  width: "divideWidth",
  initialScale: 1
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html lang="en">{children}</html>;
}
