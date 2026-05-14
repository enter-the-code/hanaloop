import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/framepiece/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} flex h-screen bg-slate-950 text-slate-100 antialiased`}>
        <NavBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
