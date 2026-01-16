import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Explorer",
  description: "Search movies, view details, and save favorites with personal ratings and notes."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
