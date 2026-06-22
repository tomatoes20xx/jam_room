"use client";

import Link from "next/link";
import { useState } from "react";
import type { RoomDetail } from "@jamroom/shared";
import { openBadgeStyle, rotateFor, stars, tintFor } from "@/lib/design";
import { useSaved } from "@/lib/useSaved";
import { ReviewForm } from "./ReviewForm";

const TINTS = ["#3a2f4f", "#4a2f2f", "#2f4a3e", "#43391f", "#2f3a4a", "#4a3f2f"];
const anton = "var(--font-anton), sans-serif";
const elite = "var(--font-special-elite), monospace";

export function RoomDetailView({ room }: { room: RoomDetail }) {
  const { isSaved, toggle } = useSaved();
  const [slide, setSlide] = useState(0);

  const images = room.images;
  const slideCount = Math.max(images.length, 1);
  const ci = ((slide % slideCount) + slideCount) % slideCount;
  const current = images[ci];
  const saved = isSaved(room.id);
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${room.lat},${room.lng}`;

  const factChips = [room.roomSize, room.soundproof, room.hours, room.genres.join(" / ")].filter(Boolean);
  const specRows: [string, string][] = [
    ["PRICE", `₾${room.priceNum} / hr (${room.priceTier})`],
    ["ROOM SIZE", room.roomSize],
    ["SOUNDPROOFING", room.soundproof],
    ["HOURS", room.hours],
    ["CAPACITY", room.capacity ?? "—"],
  ];

  return (
    <main style={{ position: "relative", zIndex: 2, background: "var(--paper2)", paddingBottom: 60 }}>
      {/* header band */}
      <section style={{ background: "var(--dark)", color: "var(--paper)", padding: "20px 28px 30px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Link
            href="/"
            style={{ textDecoration: "none", fontFamily: anton, letterSpacing: 1, fontSize: 14, background: "var(--paper)", color: "var(--ink)", padding: "8px 14px", boxShadow: "3px 3px 0 var(--red)" }}
          >
            ← BACK TO ROOMS
          </Link>
          <div style={{ marginTop: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div>
              {room.vip && (
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-permanent-marker), cursive",
                    fontSize: 16,
                    background: "var(--yellow)",
                    color: "var(--ink)",
                    padding: "3px 12px",
                    transform: "rotate(-3deg)",
                    border: "2px solid var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  VIP · FEATURED
                </div>
              )}
              <h1 style={{ margin: 0, fontFamily: anton, fontSize: "clamp(38px,6vw,72px)", lineHeight: 0.88, letterSpacing: 1, textTransform: "uppercase" }}>
                {room.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, flexWrap: "wrap", fontSize: 14 }}>
                <span style={{ color: "var(--red)", fontSize: 20, letterSpacing: 2 }}>{stars(room.rating)}</span>
                <span style={{ fontFamily: anton, fontSize: 18 }}>{room.rating.toFixed(1)}</span>
                <span style={{ opacity: 0.75 }}>{room.reviewCount} reviews</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--red)" }}>⚲</span> {room.neighborhood}
                </span>
                <span style={openBadgeStyle(room.open)}>{room.open ? "OPEN NOW" : "CLOSED"}</span>
              </div>
            </div>
            <button
              onClick={() => toggle(room.id)}
              style={{
                cursor: "pointer",
                fontFamily: anton,
                letterSpacing: 1,
                fontSize: 15,
                padding: "11px 18px",
                border: "2px solid var(--paper)",
                ...(saved ? { background: "var(--red)", color: "var(--paper)" } : { background: "var(--paper)", color: "var(--ink)" }),
              }}
            >
              ★ {saved ? "SAVED" : "SAVE"}
            </button>
          </div>
        </div>
      </section>

      {/* carousel */}
      <section style={{ padding: "26px 28px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ position: "relative", border: "4px solid var(--ink)", boxShadow: "9px 9px 0 var(--ink)", background: "var(--dark)" }}>
            <div
              style={{
                position: "relative",
                height: "clamp(260px,46vw,460px)",
                background: current?.url ? "var(--dark)" : TINTS[ci % TINTS.length],
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...(current?.url
                  ? { backgroundImage: `url(${current.url})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : {}),
              }}
            >
              {!current?.url && (
                <div style={{ position: "relative", textAlign: "center", color: "rgba(255,255,255,.92)" }}>
                  <div style={{ fontFamily: anton, fontSize: "clamp(30px,5vw,56px)", letterSpacing: 2, textTransform: "uppercase" }}>
                    {room.name}
                  </div>
                  <div style={{ fontFamily: elite, fontSize: 12, letterSpacing: 3, marginTop: 6, opacity: 0.7 }}>
                    [ NO PHOTO YET ]
                  </div>
                </div>
              )}
              {current?.label && (
                <div style={{ position: "absolute", bottom: 12, left: 14, fontFamily: elite, fontSize: 12, letterSpacing: 2, color: "var(--paper)", background: "rgba(0,0,0,.55)", padding: "4px 10px" }}>
                  {current.label}
                </div>
              )}
              <div style={{ position: "absolute", bottom: 12, right: 14, fontFamily: anton, fontSize: 15, background: "var(--ink)", color: "var(--paper)", padding: "4px 11px" }}>
                {ci + 1} / {slideCount}
              </div>
              <button onClick={() => setSlide((s) => s - 1)} style={navBtn("left")}>‹</button>
              <button onClick={() => setSlide((s) => s + 1)} style={navBtn("right")}>›</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSlide(i)}
                style={{
                  cursor: "pointer",
                  fontFamily: elite,
                  fontSize: 11,
                  letterSpacing: 1,
                  padding: "6px 10px",
                  border: "2px solid var(--ink)",
                  ...(i === ci ? { background: "var(--ink)", color: "var(--paper)" } : { background: "var(--paper)", color: "var(--ink)" }),
                }}
              >
                {img.label || `PHOTO ${i + 1}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* two columns */}
      <section style={{ padding: "30px 28px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 34, alignItems: "start" }}>
          {/* LEFT */}
          <div>
            <div style={{ background: "var(--paper)", border: "3px solid var(--ink)", padding: "20px 22px", boxShadow: "6px 6px 0 var(--ink)" }}>
              <h2 style={{ margin: "0 0 10px", fontFamily: anton, fontSize: 26, letterSpacing: 1 }}>THE ROOM</h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{room.longOverview || room.overview}</p>
              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {factChips.map((f) => (
                  <span key={f} style={{ fontFamily: elite, fontSize: 12, border: "2px solid var(--ink)", padding: "5px 9px", background: "var(--yellow)" }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <h2 style={{ margin: "30px 0 14px", fontFamily: anton, fontSize: 26, letterSpacing: 1, display: "flex", alignItems: "center", gap: 12 }}>
              THE GEAR <span style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg, var(--ink) 0 10px, transparent 10px 18px)" }} />
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {room.gear.map((grp) => (
                <div key={grp.id} style={{ background: "var(--paper)", border: "3px solid var(--ink)", padding: "14px 16px" }}>
                  <div style={{ fontFamily: anton, fontSize: 16, letterSpacing: 1, color: "var(--paper)", background: "var(--ink)", display: "inline-block", padding: "3px 9px", marginBottom: 10 }}>
                    {grp.title}
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                    {grp.items.map((it, i) => (
                      <li key={i} style={{ fontSize: 13.5, lineHeight: 1.35, display: "flex", gap: 8 }}>
                        <span style={{ color: "var(--red)" }}>▸</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ background: "var(--paper)", border: "3px solid var(--ink)", boxShadow: "6px 6px 0 var(--ink)" }}>
              <div style={{ fontFamily: anton, fontSize: 16, letterSpacing: 1, padding: "10px 14px", background: "var(--ink)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>LOCATION</span>
                <span style={{ fontFamily: elite, fontSize: 11, color: "var(--yellow)" }}>GOOGLE MAPS</span>
              </div>
              <div style={{ position: "relative", height: 210, overflow: "hidden", background: "#c8cdbd" }}>
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, #b9bfac 0 1px, transparent 1px 38px), repeating-linear-gradient(90deg, #b9bfac 0 1px, transparent 1px 46px)" }} />
                <div style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-100%)" }}>
                  <div style={{ width: 30, height: 30, background: "var(--red)", border: "3px solid var(--ink)", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", boxShadow: "3px 3px 0 rgba(0,0,0,.35)" }} />
                </div>
                <div style={{ position: "absolute", bottom: 8, left: 8, fontFamily: elite, fontSize: 11, background: "var(--paper)", border: "2px solid var(--ink)", padding: "3px 7px" }}>
                  {room.lat.toFixed(4)}, {room.lng.toFixed(4)}
                </div>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 13.5, lineHeight: 1.4 }}>{room.address}</div>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener"
                  style={{ marginTop: 10, display: "inline-block", fontFamily: anton, letterSpacing: 1, fontSize: 14, textDecoration: "none", color: "var(--paper)", background: "var(--red)", padding: "9px 14px", boxShadow: "3px 3px 0 var(--ink)" }}
                >
                  OPEN IN MAPS ↗
                </a>
              </div>
            </div>

            <div style={{ background: "var(--ink)", color: "var(--paper)", border: "3px solid var(--ink)", padding: "16px 18px" }}>
              <div style={{ fontFamily: anton, fontSize: 16, letterSpacing: 1, color: "var(--yellow)", marginBottom: 12 }}>THE DETAILS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {specRows.map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5, borderBottom: "1px dashed rgba(239,233,216,.3)", paddingBottom: 9 }}>
                    <span style={{ color: "#b8b09a", letterSpacing: 1 }}>{k}</span>
                    <span style={{ fontFamily: anton, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* reviews */}
      <section style={{ padding: "36px 28px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 18px", fontFamily: anton, fontSize: 30, letterSpacing: 1, display: "flex", alignItems: "center", gap: 14 }}>
            FROM THE PIT{" "}
            <span style={{ fontFamily: "var(--font-permanent-marker), cursive", fontSize: 18, color: "var(--red)", transform: "rotate(-3deg)" }}>reviews</span>
            <span style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg, var(--ink) 0 10px, transparent 10px 18px)" }} />
          </h2>
          <ReviewForm roomId={room.id} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20, marginTop: 20 }}>
            {room.reviews.map((rv) => {
              const initials = rv.authorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div
                  key={rv.id}
                  style={{ background: "var(--paper)", border: "3px solid var(--ink)", padding: "16px 18px", boxShadow: "4px 4px 0 var(--ink)", transform: `rotate(${rotateFor(rv.authorName)}deg)` }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 40, height: 40, background: "var(--ink)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: anton, fontSize: 16 }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontFamily: anton, fontSize: 16, letterSpacing: 0.5 }}>{rv.authorName}</div>
                      <div style={{ fontSize: 11, opacity: 0.65 }}>{new Date(rv.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ marginLeft: "auto", color: "var(--red)", fontSize: 14, letterSpacing: 1 }}>{stars(rv.rating)}</div>
                  </div>
                  <p style={{ margin: "11px 0 0", fontSize: 14, lineHeight: 1.5 }}>{rv.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function navBtn(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: 12,
    top: "50%",
    transform: "translateY(-50%)",
    width: 46,
    height: 46,
    border: 0,
    background: "var(--red)",
    color: "var(--paper)",
    fontSize: 24,
    cursor: "pointer",
    boxShadow: "3px 3px 0 var(--ink)",
  } as React.CSSProperties;
}
