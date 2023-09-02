import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import "@/lib/styles/globals.css";

import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConvoCrowd",
  description: "A social media platform for unopinionated conversations.",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("light bg-white text-slate-900 antialiased")}
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-screen bg-slate-50 pt-10 antialiased dark:bg-zinc-900 dark:text-slate-50",
          inter.className,
        )}
        // for next theme to not throw hydration warning
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          {authModal}
          <div className="container h-full max-w-7xl pt-10">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
