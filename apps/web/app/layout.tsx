import type { Metadata } from "next";
import { Anton, Special_Elite, Permanent_Marker, Noto_Sans_Georgian } from "next/font/google";
import { SavedProvider } from "@/components/SavedProvider";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const specialElite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-special-elite" });
const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
});
// Georgian fallback for the heavy Anton headings. Anton ships Latin-only, so
// Georgian glyphs would otherwise drop to a normal-weight system font. Loading
// a single heavy weight makes Georgian render bold to match the Latin display.
const georgianDisplay = Noto_Sans_Georgian({
  weight: "800",
  subsets: ["georgian"],
  variable: "--font-anton-ge",
});

export const metadata: Metadata = {
  title: "Jam Room — Find a room. Plug in. Get loud.",
  description: "იპოვე სარეპეტიციო და ჯემ-სესიის ოთახები თბილისში. დაჯავშნე საათობრივად.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={`${anton.variable} ${specialElite.variable} ${permanentMarker.variable} ${georgianDisplay.variable}`}>
      <body>
        <div className="jr-grain" aria-hidden />
        <LangProvider>
          <SavedProvider>{children}</SavedProvider>
        </LangProvider>
      </body>
    </html>
  );
}
