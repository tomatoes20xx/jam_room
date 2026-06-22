"use client";

import { useT } from "@/lib/i18n";

export function ApiOffline({ detail }: { detail: string }) {
  const { t } = useT();
  const msg = detail || t("home.offline_error");
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "60px 28px" }}>
      <div style={{ border: "3px dashed var(--ink)", background: "var(--paper)", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif", fontSize: 34 }}>{t("home.offline_title")}</div>
        <p style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 14 }}>
          {t("home.offline_pre", { error: msg })} <code>pnpm dev</code> {t("home.offline_post")}
        </p>
      </div>
    </main>
  );
}
