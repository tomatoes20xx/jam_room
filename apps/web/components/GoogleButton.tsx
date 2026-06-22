"use client";

import { signIn } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

const anton = "var(--font-anton), sans-serif";

export function GoogleButton({ label = "CONTINUE WITH GOOGLE", compact = false }: { label?: string; compact?: boolean }) {
  const onClick = () =>
    signIn.social({ provider: "google", callbackURL: typeof window !== "undefined" ? window.location.origin : undefined }).catch(
      () => {
        // Likely Google OAuth isn't configured yet.
        alert("Google sign-in is not configured. Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET on the API.");
      },
    );
  void API_URL;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: compact ? undefined : "100%",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: compact ? 10 : 12,
        background: "var(--paper)",
        color: "var(--ink)",
        border: "3px solid var(--ink)",
        fontFamily: anton,
        letterSpacing: 1,
        fontSize: compact ? 14 : 16,
        padding: compact ? "9px 14px" : 13,
        boxShadow: compact ? "3px 3px 0 var(--ink)" : "4px 4px 0 var(--ink)",
      }}
    >
      <span style={{ display: "flex", width: 22, height: 22, background: "#fff", border: "2px solid var(--ink)", alignItems: "center", justifyContent: "center" }}>
        <svg width="13" height="13" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.4 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7C43.9 37.7 46.5 31.6 46.5 24.5z" />
          <path fill="#FBBC05" d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.2C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.9-6.2z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.2-8.5 2.2-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.4 42.6 14.6 48 24 48z" />
        </svg>
      </span>
      {label}
    </button>
  );
}
