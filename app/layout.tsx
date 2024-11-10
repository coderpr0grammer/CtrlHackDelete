import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ICPProvider } from "./infrastructure/ICP/ICPContext";
import './polyfills'

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

export const metadata: Metadata = {
  title: "MarxistRaise",
  description: "Crowdfunding for the rest of us.",
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
        <ICPProvider>
        {children}
        </ICPProvider>
      </body>
    </html>
  );
}
