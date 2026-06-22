"use client";

import Link from "next/link";
import { useSaved } from "@/lib/useSaved";
import { useT } from "@/lib/i18n";

export function SavedBadge() {
  const { saved } = useSaved();
  const { t } = useT();
  return (
    <Link
      href="/saved"
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 7,
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif",
        fontSize: 14,
        letterSpacing: 1,
        padding: "9px 13px",
        transform: "rotate(1deg)",
        boxShadow: "3px 3px 0 var(--red)",
      }}
    >
      <span style={{ color: "var(--red)", fontSize: 16 }}>★</span>
      <span>{t("saved.badge", { count: saved.length })}</span>
    </Link>
  );
}
