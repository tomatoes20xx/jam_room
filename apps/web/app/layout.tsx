import type { Metadata } from "next";
import { Anton, Special_Elite, Permanent_Marker } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const specialElite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-special-elite" });
const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
});

export const metadata: Metadata = {
  title: "Jam Room — Find a room. Plug in. Get loud.",
  description: "Find rehearsal and jam-session rooms across Tbilisi. Book by the hour.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${specialElite.variable} ${permanentMarker.variable}`}>
      <body>
        <div className="jr-grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
