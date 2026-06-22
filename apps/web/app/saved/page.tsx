"use client";

import { useEffect, useState } from "react";
import type { RoomCard as RoomCardType } from "@jamroom/shared";
import { api } from "@/lib/api";
import { useSaved } from "@/lib/useSaved";
import { useSession } from "@/lib/auth-client";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { RoomCard } from "@/components/RoomCard";
import { useT } from "@/lib/i18n";

const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

export default function SavedPage() {
  const { t } = useT();
  const { saved, isSaved, toggle } = useSaved();
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id ?? null;
  const [serverRooms, setServerRooms] = useState<RoomCardType[]>([]);

  // Signed-in: the server is the source of truth — fetch the saved cards
  // directly. Signed-out: saves live only in localStorage, so resolve them
  // against the catalog (a small first page is plenty for anonymous use).
  // Wait for the session to resolve so we don't fetch the wrong source first.
  useEffect(() => {
    if (isPending) return;
    if (userId) {
      api.listSaved().then(setServerRooms).catch(() => setServerRooms([]));
    } else {
      api.listRooms({ limit: 60 }).then((res) => setServerRooms(res.rooms)).catch(() => setServerRooms([]));
    }
  }, [isPending, userId]);

  // Intersect with the live saved set so an optimistic unsave drops the card
  // immediately (without refetching). For signed-in users serverRooms already
  // is the saved set, so this only filters out anything just unsaved.
  const rooms = serverRooms.filter((r) => saved.includes(r.id));

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      <main style={{ background: "var(--paper2)", padding: "40px 28px 70px", minHeight: "50vh" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontFamily: anton, fontSize: 40, letterSpacing: 1, textTransform: "uppercase" }}>
              {t("saved.title_pre")} <span style={{ color: "var(--red)" }}>{t("saved.title_accent")}</span>
            </h1>
            <div style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg, var(--ink) 0 12px, transparent 12px 22px)" }} />
          </div>
          {rooms.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", border: "3px dashed var(--ink)", background: "var(--paper)" }}>
              <div style={{ fontFamily: anton, fontSize: 36, transform: "rotate(-2deg)" }}>{t("saved.empty_title")}</div>
              <p style={{ fontFamily: elite, fontSize: 15 }}>{t("saved.empty_body")}</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 26 }}>
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} saved={isSaved(room.id)} onToggleSave={toggle} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
