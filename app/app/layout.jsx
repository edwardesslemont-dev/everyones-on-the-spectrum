import { Inter, Playfair_Display, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-playfair" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-source-serif" });

export const metadata = {
  title: "Everyone's on the Spectrum",
  description: "Every story. Every angle. Facts first — then all four perspectives.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${sourceSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
