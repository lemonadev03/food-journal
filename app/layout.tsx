import type { Metadata, Viewport } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { stackServerApp } from "../stack/server";
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

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Often good for app-like feel
};

export const metadata: Metadata = {
  title: {
    default: "Food Journal",
    template: "%s | Food Journal",
  },
  description: "A clean, modern food journal designed for mobile first. Log meals, track habits, and stay consistent.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg", // Reusing SVG for now, ideally PNG for Apple but Safari handles SVG decently or fallback
  },
  // manifest: "/manifest.json", // Next.js 14+ with manifest.ts automatically generates the link
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Food Journal",
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await stackServerApp.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <main className={`flex min-h-screen flex-col items-center md:pb-0 ${user ? "pb-20" : ""}`}>
               {children}
            </main>
            {user && <MobileNav />}
            <Toaster />
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
