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
    <html lang="en" className="">
      <body className={`${inter.className} antialised`}>
        <div className="container min-h-screen mx-auto max-w-screen-md">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
