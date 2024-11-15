import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ICPProvider } from "./infrastructure/ICP/ICPContext";
import './polyfills';
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Get canister ID from environment variables
const getCanisterId = () => {
  if (process.env.DFX_NETWORK === 'ic') {
    return process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID_IC as string;
  }
  return process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID_LOCAL || 'rrkah-fqaaa-aaaaa-aaaaq-cai';
};

export const metadata: Metadata = {
  title: "MarxistRaise",
  description: "Crowdfunding for the rest of us.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const canisterId = getCanisterId();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ICPProvider >
          {children}
          <Toaster />
        </ICPProvider>
      </body>
    </html>
  );
}