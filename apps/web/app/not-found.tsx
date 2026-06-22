"use client";

import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useT();
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      <main style={{ background: "var(--paper2)", padding: "80px 28px", minHeight: "50vh" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif", fontSize: "clamp(48px,10vw,96px)", transform: "rotate(-2deg)", lineHeight: 0.9 }}>
            {t("nf.title")}
          </div>
          <p style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 16, margin: "18px 0 26px" }}>
            {t("nf.body")}
          </p>
          <Link href="/" style={{ textDecoration: "none", fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif", letterSpacing: 1, fontSize: 17, padding: "13px 24px", background: "var(--red)", color: "var(--paper)", boxShadow: "5px 5px 0 var(--ink)" }}>
            {t("nf.back")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
