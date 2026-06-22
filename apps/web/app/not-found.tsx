import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      <main style={{ background: "var(--paper2)", padding: "80px 28px", minHeight: "50vh" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: "clamp(48px,10vw,96px)", transform: "rotate(-2deg)", lineHeight: 0.9 }}>
            ALL QUIET.
          </div>
          <p style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 16, margin: "18px 0 26px" }}>
            That room is not on the bill. Head back to the listings.
          </p>
          <Link href="/" style={{ textDecoration: "none", fontFamily: "var(--font-anton), sans-serif", letterSpacing: 1, fontSize: 17, padding: "13px 24px", background: "var(--red)", color: "var(--paper)", boxShadow: "5px 5px 0 var(--ink)" }}>
            ← BACK TO ROOMS
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
