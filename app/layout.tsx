import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { PriceTicker } from "@/components/dashboard/PriceTicker";
import { PageTransition } from "@/components/motion/PageTransition";
import { Toaster } from "@/components/ui/Toaster";

const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SkinPulse — CS2 Skin Price Tracker",
  description:
    "Live CS2 skin price tracking, analytics, and alerts. Track your watchlist across the Steam Community Market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-base-950 font-sans antialiased`}>
        <div className="pointer-events-none fixed inset-0 bg-grid-fade bg-[length:100%_48px] opacity-40" />
        <Header />
        <PriceTicker />
        <PageTransition>{children}</PageTransition>
        <Toaster />
      </body>
    </html>
  );
}
