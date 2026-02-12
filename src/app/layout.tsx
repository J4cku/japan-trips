import type { Metadata } from "next";
import { Inter, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "TripMag — Your Trip. Perfectly Personalized.",
    template: "%s — TripMag",
  },
  description:
    "AI-powered interactive trip magazines. Personalized travel content, beautifully designed.",
  other: {
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${playfair.variable} ${spaceMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
