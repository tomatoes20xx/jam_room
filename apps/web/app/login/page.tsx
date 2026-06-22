"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { GoogleButton } from "@/components/GoogleButton";
import { AuthField } from "@/components/AuthField";
import { useT } from "@/lib/i18n";

const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

export default function LoginPage() {
  const { t } = useT();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await signIn.email({ email, password });
    setBusy(false);
    if (err) {
      setError(err.message ?? t("login.error"));
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      <main style={{ background: "var(--paper2)", padding: "50px 28px 70px" }}>
        <div style={{ maxWidth: 460, margin: "0 auto", background: "var(--paper)", border: "3px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)", padding: "28px 28px 32px" }}>
          <h1 style={{ margin: "0 0 20px", fontFamily: anton, fontSize: 40, letterSpacing: 1, textTransform: "uppercase" }}>
            {t("login.title_pre")}<span style={{ color: "var(--red)" }}> {t("login.title_accent")}</span>
          </h1>
          <GoogleButton label={t("login.google")} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
            <span style={{ flex: 1, height: 2, background: "var(--ink)", opacity: 0.3 }} />
            <span style={{ fontFamily: elite, fontSize: 12, letterSpacing: 1 }}>{t("login.or_email")}</span>
            <span style={{ flex: 1, height: 2, background: "var(--ink)", opacity: 0.3 }} />
          </div>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <AuthField label={t("login.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@band.ge" required />
            <AuthField label={t("login.password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            {error && <div style={{ color: "var(--red)", fontFamily: elite, fontSize: 13 }}>{error}</div>}
            <button
              type="submit"
              disabled={busy}
              style={{ marginTop: 6, cursor: "pointer", fontFamily: anton, letterSpacing: 1.5, fontSize: 18, padding: 14, background: "var(--red)", color: "var(--paper)", border: 0, boxShadow: "5px 5px 0 var(--ink)", opacity: busy ? 0.6 : 1 }}
            >
              {busy ? "…" : t("login.submit")}
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: 18, fontFamily: elite, fontSize: 13 }}>
            {t("login.new_here")}{" "}
            <Link href="/signup" style={{ color: "var(--ink)", borderBottom: "3px solid var(--red)", fontFamily: anton, letterSpacing: 1, textDecoration: "none" }}>
              {t("nav.signup")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
