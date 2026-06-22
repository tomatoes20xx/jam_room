"use client";

import Link from "next/link";
import type { RoomCard as RoomCardType } from "@jamroom/shared";
import { cardStyle, openBadgeStyle, saveStyle, stars, thumbStyle, tintFor } from "@/lib/design";
import { useT } from "@/lib/i18n";

type Props = {
  room: RoomCardType;
  featured?: boolean;
  saved: boolean;
  onToggleSave: (id: string) => void;
  vipLabel?: string;
};

export function RoomCard({ room, featured = false, saved, onToggleSave, vipLabel = "VIP" }: Props) {
  const { t } = useT();
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave(room.id);
  };

  return (
    <Link href={`/rooms/${room.id}`} style={{ textDecoration: "none", color: "var(--ink)" }}>
      <article style={cardStyle(room.vip)}>
        {featured && room.vip && (
          <div
            style={{
              position: "absolute",
              top: -14,
              right: 14,
              zIndex: 3,
              fontFamily: "var(--font-permanent-marker), cursive",
              fontSize: 18,
              background: "var(--yellow)",
              color: "var(--ink)",
              padding: "4px 12px",
              transform: "rotate(5deg)",
              boxShadow: "3px 3px 0 #000",
              border: "2px solid var(--ink)",
            }}
          >
            {vipLabel}
          </div>
        )}
        <button onClick={handleSave} style={saveStyle(saved)} aria-label={saved ? t("room.unsave") : t("room.save")}>
          ★
        </button>
        <div style={thumbStyle(tintFor(room.id), room.primaryImage?.url)}>
          <span
            style={{
              fontFamily: "var(--font-special-elite), monospace",
              fontSize: 12,
              letterSpacing: 2,
              color: "rgba(255,255,255,.85)",
              background: "rgba(0,0,0,.35)",
              padding: "4px 8px",
            }}
          >
            {room.primaryImage?.label || room.neighborhood}
          </span>
          <span style={openBadgeStyle(room.open)}>{room.open ? t("room.open_now") : t("room.closed")}</span>
        </div>
        <div style={{ padding: featured ? "16px 18px 20px" : "15px 16px 18px" }}>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif",
              fontSize: featured ? 27 : 23,
              letterSpacing: 0.5,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {room.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, fontSize: 12.5 }}>
            <span style={{ color: "var(--red)", fontSize: 15, letterSpacing: 1 }}>{stars(room.rating)}</span>
            <span style={{ fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif" }}>{room.rating.toFixed(1)}</span>
            <span style={{ opacity: 0.7 }}>({room.reviewCount})</span>
          </div>
          <div style={{ marginTop: 7, fontSize: 12.5, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "var(--red)" }}>⚲</span> {room.neighborhood}
          </div>
          <div style={{ marginTop: 11, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {room.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                style={{
                  fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif",
                  fontSize: 10.5,
                  letterSpacing: 1,
                  padding: "3px 7px",
                  background: "var(--ink)",
                  color: "var(--paper)",
                }}
              >
                {g}
              </span>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "2px dashed var(--ink)",
              paddingTop: 12,
            }}
          >
            <span style={{ fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif", fontSize: 16 }}>
              ₾{room.priceNum}
              <span style={{ fontSize: 11, fontFamily: "var(--font-special-elite), monospace" }}> {t("room.per_hour")}</span>
            </span>
            <span
              style={{
                fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif",
                fontSize: 13,
                letterSpacing: 1,
                color: "var(--ink)",
                borderBottom: "3px solid var(--red)",
              }}
            >
              {t("room.enter")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
