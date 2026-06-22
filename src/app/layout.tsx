import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "La vague de transmission des PME françaises 2025-2035 — Institut Sapiens",
  description:
    "700 000 entreprises à transmettre, 3,3 millions d'emplois concernés. Institut Sapiens analyse la vague de transmission des PME françaises sur la décennie 2025-2035.",
  openGraph: {
    title: "La vague de transmission des PME françaises 2025-2035",
    description: "Visualisation des données de transmission d'entreprises en France.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
