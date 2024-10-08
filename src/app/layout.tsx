"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import { useEffect } from "react";

const inter = Inter({ subsets: ["cyrillic", "latin"] });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialised`}>
        <div className="container min-h-screen mx-auto max-w-screen-lg">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
