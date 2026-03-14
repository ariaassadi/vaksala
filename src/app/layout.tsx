import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-card",
});

export const metadata: Metadata = {
  title: "Vaksala KR-cupen 25/26 — FIFA Cards",
  description: "FIFA Cards — Season Stats & Awards for Vaksala KR-cupen 25/26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="dark">
      <body className={`${inter.variable} ${oswald.variable} bg-zinc-950 text-zinc-100 antialiased`}>
        {/* Animated background */}
        <div className="bubbles-container" aria-hidden="true">
          {/* Floating bubbles */}
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          {/* Glowing orbs */}
          <div className="glow-orb" />
          <div className="glow-orb" />
          <div className="glow-orb" />
          <div className="glow-orb" />
          {/* Floating particles */}
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>
        <Navbar />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
