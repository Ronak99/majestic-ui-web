import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import Footer from "./components/footer";
import DataLoader from "./components/data-loader";
import Header from "./components/header";
import { supabase } from "@/lib/supabase/client";
import { useAuthInitializer } from "@/hooks/useAuthInitializer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Majestic UI",
  description: "Beautifully designed Flutter Widgets.",
  keywords: ["majestic ui", "flutter", "android", "ios"],
  openGraph: {
    images: ["/majestic-ui.png"],
    title: "Majestic UI",
    description:
      "Beautifully designed Flutter widgets that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    siteName: "https://www.majesticui.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Majestic UI",
    description:
      "Beautifully designed Flutter widgets that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    site: "https://www.majesticui.com",
    creator: "Ronak99",
    creatorId: "https://x.com/The_RonakPunase",
    images: ["/majestic-ui.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-svh bg-background">
            <Header />
            {children}
            {/* <Analytics /> */}
            <DataLoader />
            <Footer />
            <Toaster theme="dark" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
