import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/app/components/context/FavoritesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/logo.svg",
  },
  title: "React Bytes",
  description: "React Bytes",
};

import AppShell from "./components/layout/AppShell";
import { PreviewProvider } from "./components/context/PreviewContext";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <PreviewProvider>
            <FavoritesProvider>
              <AppShell>{children}</AppShell>
            </FavoritesProvider>
          </PreviewProvider>
        </Suspense>
      </body>
    </html>
  );
}
