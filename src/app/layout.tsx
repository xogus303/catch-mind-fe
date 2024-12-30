import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { UserStoreProvider } from "@/providers/user-store-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "마음읽기",
  description: "상대방의 마음을 읽고 정답을 맞춰보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-[100%]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-[100%]`}
      >
        <UserStoreProvider>{children}</UserStoreProvider>
      </body>
    </html>
  );
}
