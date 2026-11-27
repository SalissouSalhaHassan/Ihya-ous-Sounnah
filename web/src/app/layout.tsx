import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale-context";
import { AppShell } from "@/components/AppShell";
import { PwaManager } from "@/components/PwaManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ihya'ous Sounnah",
  description: "المنظومة المتكاملة لإدارة الأوقاف والمراكز الدعوية والمساجد وحلقات القرآن الكريم",
  applicationName: "Ihya'ous Sounnah",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ihya'ous Sounnah",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <Suspense
            fallback={
              <div className="min-h-screen bg-slate-950 text-slate-100">
                {children}
              </div>
            }
          >
            <AppShell>{children}</AppShell>
            <PwaManager />
          </Suspense>
        </LocaleProvider>
      </body>
    </html>
  );
}
