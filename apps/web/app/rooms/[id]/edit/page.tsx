"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { RoomDetail } from "@jamroom/shared";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { RoomForm } from "@/components/RoomForm";
import { useT } from "@/lib/i18n";

const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

export default function EditRoomPage() {
  const { t } = useT();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: session, isPending } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getRoom(id)
      .then(setRoom)
      .catch((e) => setError(e instanceof Error ? e.message : t("dash.load_error")));
  }, [id, t]);

  const isOwner = room && userId && room.ownerId === userId;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      <main style={{ position: "relative", zIndex: 2 }}>
        <section style={{ background: "var(--paper)", borderBottom: "4px solid var(--ink)", padding: "40px 28px 30px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <Link href="/dashboard" style={{ fontFamily: anton, letterSpacing: 1, fontSize: 13, textDecoration: "none", color: "var(--ink)", borderBottom: "3px solid var(--red)" }}>
              {t("newroom.cancel")}
            </Link>
            <h1 style={{ margin: "18px 0 0", fontFamily: anton, fontSize: "clamp(40px,6.5vw,80px)", lineHeight: 0.9, letterSpacing: 1, textTransform: "uppercase" }}>
              {t("editroom.title_pre")} <span style={{ color: "var(--red)" }}>{t("editroom.title_accent")}</span>
            </h1>
            <p style={{ fontFamily: elite, fontSize: 15, margin: "14px 0 0" }}>{t("editroom.subtitle")}</p>
          </div>
        </section>

        <section style={{ background: "var(--paper2)", padding: "38px 28px 70px", minHeight: "50vh" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            {error ? (
              <Guard text={error} cta={t("detail.back")} href="/dashboard" />
            ) : isPending || !room ? null : !session ? (
              <Guard text={t("newroom.signin")} cta={t("nav.signin")} href="/login" />
            ) : !isOwner ? (
              <Guard text={t("editroom.not_owner")} cta={t("dash.view")} href={`/rooms/${id}`} />
            ) : (
              <RoomForm mode="edit" initial={room} onSaved={(r) => router.push(`/rooms/${r.id}`)} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Guard({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", border: "3px dashed var(--ink)", background: "var(--paper)" }}>
      <p style={{ fontFamily: elite, fontSize: 15, margin: "0 0 18px" }}>{text}</p>
      <Link href={href} style={{ textDecoration: "none", fontFamily: anton, letterSpacing: 1, fontSize: 16, padding: "11px 20px", background: "var(--red)", color: "var(--paper)", boxShadow: "4px 4px 0 var(--ink)" }}>
        {cta}
      </Link>
    </div>
  );
}
