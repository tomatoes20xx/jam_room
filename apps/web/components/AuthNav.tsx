"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const anton = "var(--font-anton), sans-serif";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AuthNav() {
  const { data: session, isPending } = useSession();

  // Keep a stable footprint during the initial session fetch to avoid layout flash.
  if (isPending) {
    return <div style={{ width: 92, height: 38 }} aria-hidden />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        style={{
          textDecoration: "none",
          fontFamily: anton,
          fontSize: 14,
          letterSpacing: 1,
          color: "var(--paper)",
          border: "2px solid var(--paper)",
          padding: "8px 13px",
        }}
      >
        SIGN IN
      </Link>
    );
  }

  const user = session.user as { name?: string | null; displayName?: string | null; email: string; image?: string | null };
  const label = user.displayName || user.name || user.email;
  const initials = initialsOf(label);

  return (
    <Link
      href="/profile"
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 9,
        background: "var(--paper)",
        color: "var(--ink)",
        padding: "5px 11px 5px 5px",
        boxShadow: "3px 3px 0 var(--red)",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: user.image ? `center/cover no-repeat url(${user.image})` : "var(--ink)",
          color: "var(--paper)",
          fontFamily: anton,
          fontSize: 13,
          letterSpacing: 0.5,
        }}
      >
        {user.image ? "" : initials}
      </span>
      <span style={{ fontFamily: anton, fontSize: 14, letterSpacing: 1, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
    </Link>
  );
}
