"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-main">
      <body className={`${inter.className} antialised`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
