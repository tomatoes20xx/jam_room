"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useT } from "@/lib/i18n";

const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

export function ReviewForm({ roomId }: { roomId: string }) {
  const { t } = useT();
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <div style={{ fontFamily: elite, fontSize: 13, border: "2px dashed var(--ink)", padding: "12px 14px", background: "var(--paper)" }}>
        <a href="/login" style={{ color: "var(--ink)", borderBottom: "3px solid var(--red)", fontFamily: anton, letterSpacing: 1, textDecoration: "none" }}>
          {t("nav.signin")}
        </a>{" "}
        {t("review.signin_suffix")}
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api.addReview(roomId, { rating, text: text.trim() });
      setText("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("review.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ background: "var(--paper)", border: "3px solid var(--ink)", padding: "16px 18px", boxShadow: "4px 4px 0 var(--ink)", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: anton, letterSpacing: 1, fontSize: 14 }}>{t("review.your_rating")}</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            style={{ cursor: "pointer", border: 0, background: "transparent", color: "var(--red)", fontSize: 22, opacity: n <= rating ? 1 : 0.3 }}
            aria-label={t("review.stars", { n })}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("review.placeholder")}
        style={{ minHeight: 70, resize: "vertical", border: "3px solid var(--ink)", background: "var(--paper)", fontFamily: elite, fontSize: 14, padding: 12, color: "var(--ink)", outline: "none" }}
      />
      {error && <div style={{ color: "var(--red)", fontFamily: elite, fontSize: 13 }}>{error}</div>}
      <button
        type="submit"
        disabled={busy}
        style={{ alignSelf: "flex-start", cursor: "pointer", fontFamily: anton, letterSpacing: 1, fontSize: 15, padding: "10px 18px", background: "var(--red)", color: "var(--paper)", border: 0, boxShadow: "4px 4px 0 var(--ink)", opacity: busy ? 0.6 : 1 }}
      >
        {busy ? t("review.posting") : t("review.post")}
      </button>
    </form>
  );
}
