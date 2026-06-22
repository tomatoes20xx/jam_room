import Link from "next/link";
import { SavedBadge } from "./SavedBadge";
import { AuthNav } from "./AuthNav";

export function Masthead() {
  return (
    <header style={{ position: "relative", background: "var(--dark)", color: "var(--paper)", padding: "18px 28px 30px", zIndex: 5 }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              background: "var(--red)",
              color: "var(--paper)",
              fontFamily: "var(--font-anton), sans-serif",
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
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 34, letterSpacing: 2, lineHeight: 1 }}>
              FINDER<span style={{ color: "var(--red)" }}>.</span>
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
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
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
            TBILISI
            <br />
            SAQARTVELO
          </div>
          <SavedBadge />
          <AuthNav />
        </div>
      </div>
      <Ticker />
    </header>
  );
}

const TICKER =
  "★ NO BAD VIBES ★ BYO STICKS ★ AMPS ON 11 ★ SOUNDPROOFED ★ HOURLY RATES ★ DRUMMERS WELCOME ★ LATE NIGHT SLOTS ";

export function Ticker() {
  return (
    <div
      style={{
        marginTop: 18,
        overflow: "hidden",
        borderTop: "2px solid var(--red)",
        borderBottom: "2px solid var(--red)",
        padding: "5px 0",
        background: "#0f0d09",
      }}
    >
      <div className="jr-marquee-track">
        <span
          style={{
            fontFamily: "var(--font-anton), sans-serif",
            letterSpacing: 3,
            fontSize: 13,
            color: "var(--yellow)",
            paddingLeft: 10,
          }}
        >
          {TICKER}
          {TICKER}
        </span>
      </div>
    </div>
  );
}
