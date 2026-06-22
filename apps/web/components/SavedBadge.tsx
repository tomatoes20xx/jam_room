"use client";

import Link from "next/link";
import { useSaved } from "@/lib/useSaved";

export function SavedBadge() {
  const { saved } = useSaved();
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
        fontFamily: "var(--font-anton), sans-serif",
        fontSize: 14,
        letterSpacing: 1,
        padding: "9px 13px",
        transform: "rotate(1deg)",
        boxShadow: "3px 3px 0 var(--red)",
      }}
    >
      <span style={{ color: "var(--red)", fontSize: 16 }}>★</span>
      <span>{saved.length} SAVED</span>
    </Link>
  );
}
