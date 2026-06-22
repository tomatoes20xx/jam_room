"use client";

import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 2,
        background: "var(--dark)",
        color: "#b8b09a",
        padding: "30px 28px",
        borderTop: "4px solid var(--red)",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif", color: "var(--paper)", fontSize: 22, letterSpacing: 1 }}>
          JAMROOM {t("brand.finder")}<span style={{ color: "var(--red)" }}>.</span>
        </div>
        <div style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 12 }}>
          {t("footer.tagline")}
        </div>
      </div>
    </footer>
  );
}
