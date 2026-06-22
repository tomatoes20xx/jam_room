"use client";

import Link from "next/link";
import { SavedBadge } from "./SavedBadge";
import { AuthNav } from "./AuthNav";
import { LangToggle, useT } from "@/lib/i18n";

export function Masthead() {
  const { t } = useT();
  return (
    <header style={{ position: "relative", background: "var(--dark)", color: "var(--paper)", padding: "18px 28px 30px", zIndex: 5 }}>
      <div className="jr-masthead">
        <Link href="/" className="jr-masthead-brand" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              background: "var(--red)",
              color: "var(--paper)",
              fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif",
              fontSize: 30,
              lineHeight: 0.82,
              letterSpacing: 1,
              padding: "10px 12px 8px",
              transform: "rotate(-3deg)",
              boxShadow: "5px 5px 0 #000",
            }}
          >
            JAM
            <br />
            ROOM
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif", fontSize: 34, letterSpacing: 2, lineHeight: 1 }}>
              {t("brand.finder")}<span style={{ color: "var(--red)" }}>.</span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-permanent-marker), cursive",
                color: "var(--yellow)",
                fontSize: 14,
                transform: "rotate(-1.5deg)",
                marginTop: 2,
              }}
            >
              plug in &amp; get loud
            </div>
          </div>
        </Link>
        <div className="jr-masthead-lang">
          <div
            className="jr-masthead-city"
            style={{
              fontFamily: "var(--font-special-elite), monospace",
              fontSize: 13,
              color: "#b8b09a",
              textAlign: "right",
              lineHeight: 1.4,
              borderLeft: "2px solid var(--red)",
              paddingLeft: 12,
            }}
          >
            {t("masthead.city")}
            <br />
            {t("masthead.country")}
          </div>
          <LangToggle />
        </div>
        <div className="jr-masthead-actions">
          <SavedBadge />
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
