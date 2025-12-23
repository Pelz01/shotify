import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google"; // New premium fonts
import "./globals.css";

// Brand font for headings
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

// Clean, geometric font for UI
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shotify by Pelz",
  description: "Create stunning, studio-quality screenshots in seconds. Premium tools for developers and creators.",
  icons: {
    icon: "/favicon.ico", // We'll stick with default for now or generate one later
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
        className={`${outfit.variable} ${jakarta.variable} antialiased bg-white text-slate-900 overflow-x-hidden font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
