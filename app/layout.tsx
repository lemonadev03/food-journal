import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { MobileNav } from "@/components/mobile-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Food Journal",
    template: "%s | Food Journal",
  },
  description: "A clean, modern food journal designed for mobile first. Log meals, track habits, and stay consistent.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <main className="flex min-h-screen flex-col items-center pb-20 md:pb-0">
               {children}
            </main>
            <MobileNav />
            <Toaster />
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
