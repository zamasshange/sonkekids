import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonke Kids",
  description:
    "Educational games and videos from Daniel Tiger's Neighborhood, Wild Kratts and other Sonke Kids shows!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
