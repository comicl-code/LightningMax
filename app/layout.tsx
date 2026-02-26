import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { TripNav } from "@/components/layout/TripNav";

export const metadata: Metadata = {
  title: "WDW Optimizer — Collins Family March 2026",
  description: "Disney World trip optimizer for 15 people, March 15–20, 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <Header />
        <TripNav />
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
