"use client";

import { useMemo, useState } from "react";
import type { PriceTier, RoomCard as RoomCardType, RoomSort } from "@jamroom/shared";
import { chipStyle } from "@/lib/design";
import { useSaved } from "@/lib/useSaved";
import { RoomCard } from "./RoomCard";

const GENRES = ["ALL", "PUNK", "METAL", "HARDCORE", "INDIE", "ROCK", "GARAGE", "HIP-HOP", "NOISE", "JAZZ"];
const PRICES: (PriceTier | "ALL")[] = ["ALL", "$", "$$", "$$$"];
const SORTS: [RoomSort, string][] = [
  ["rating", "TOP RATED"],
  ["price", "CHEAPEST"],
  ["name", "A–Z"],
];

export function Finder({ initialRooms }: { initialRooms: RoomCardType[] }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [price, setPrice] = useState<PriceTier | null>(null);
  const [openNow, setOpenNow] = useState(false);
  const [sort, setSort] = useState<RoomSort>("rating");
  const { isSaved, toggle } = useSaved();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = initialRooms.filter((p) => {
      if (genre && !p.genres.includes(genre)) return false;
      if (price && p.priceTier !== price) return false;
      if (openNow && !p.open) return false;
      if (q) {
        const hay = `${p.name} ${p.neighborhood} ${p.genres.join(" ")} ${p.overview}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      if (sort === "price") return a.priceNum - b.priceNum;
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });
    return list;
  }, [initialRooms, query, genre, price, openNow, sort]);

  const vip = filtered.filter((p) => p.vip);
  const regular = filtered.filter((p) => !p.vip);

  const resetFilters = () => {
    setQuery("");
    setGenre(null);
    setPrice(null);
    setOpenNow(false);
  };

  const sectionHeading = "var(--font-anton), sans-serif";

  return (
    <main style={{ position: "relative", zIndex: 2 }}>
      {/* HERO / SEARCH */}
      <section style={{ position: "relative", background: "var(--paper)", borderBottom: "4px solid var(--ink)", padding: "42px 28px 38px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <h1
              style={{
                margin: "0 0 6px",
                fontFamily: sectionHeading,
                fontSize: "clamp(40px,6vw,78px)",
                lineHeight: 0.92,
                letterSpacing: 1,
                maxWidth: 780,
                textTransform: "uppercase",
              }}
            >
              Find a room. Plug in.
              <br />
              <span
                style={{
                  color: "var(--paper)",
                  background: "var(--red)",
                  padding: "2px 12px",
                  display: "inline-block",
                  transform: "rotate(-1.5deg)",
                  boxShadow: "4px 4px 0 #000",
                  marginTop: 8,
                }}
              >
                Get loud.
              </span>
            </h1>
            <div
              style={{
                fontFamily: "var(--font-special-elite), monospace",
                fontSize: 14,
                maxWidth: 240,
                lineHeight: 1.5,
                border: "2px solid var(--ink)",
                padding: "10px 12px",
                transform: "rotate(1deg)",
                background: "var(--yellow)",
              }}
            >
              {filtered.length} rehearsal rooms found across Tbilisi. Book by the hour.
            </div>
          </div>

          {/* search bar */}
          <div style={{ marginTop: 42, display: "flex", boxShadow: "7px 7px 0 var(--ink)", maxWidth: 760, border: "3px solid var(--ink)" }}>
            <div style={{ background: "var(--ink)", color: "var(--paper)", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 22 }}>⌕</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rooms, neighborhoods, gear..."
              style={{
                flex: 1,
                border: 0,
                outline: "none",
                background: "var(--paper)",
                fontFamily: "var(--font-special-elite), monospace",
                fontSize: 17,
                padding: "16px 14px",
                color: "var(--ink)",
              }}
            />
            <button
              onClick={() => setQuery("")}
              style={{
                border: 0,
                borderLeft: "3px solid var(--ink)",
                background: "var(--red)",
                color: "var(--paper)",
                fontFamily: sectionHeading,
                letterSpacing: 1,
                fontSize: 16,
                padding: "0 22px",
                cursor: "pointer",
              }}
            >
              CLEAR
            </button>
          </div>

          {/* filters */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            <FilterRow label="GENRE">
              {GENRES.map((g) => {
                const active = g === "ALL" ? !genre : genre === g;
                return (
                  <button key={g} style={chipStyle(active)} onClick={() => setGenre(g === "ALL" ? null : g)}>
                    {g}
                  </button>
                );
              })}
            </FilterRow>
            <FilterRow label="PRICE">
              {PRICES.map((p) => {
                const active = p === "ALL" ? !price : price === p;
                return (
                  <button key={p} style={chipStyle(active)} onClick={() => setPrice(p === "ALL" ? null : (p as PriceTier))}>
                    {p}
                  </button>
                );
              })}
              <span style={{ width: 2, height: 26, background: "var(--ink)", opacity: 0.3, margin: "0 4px" }} />
              <button style={chipStyle(openNow)} onClick={() => setOpenNow((v) => !v)}>
                <span style={{ fontSize: 15 }}>●</span> OPEN NOW
              </button>
            </FilterRow>
            <FilterRow label="SORT">
              {SORTS.map(([k, l]) => (
                <button key={k} style={chipStyle(sort === k)} onClick={() => setSort(k)}>
                  {l}
                </button>
              ))}
            </FilterRow>
          </div>
        </div>
      </section>

      {/* FEATURED / VIP */}
      {vip.length > 0 && (
        <section style={{ position: "relative", background: "var(--dark)", padding: "34px 28px 44px" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-permanent-marker), cursive",
                  fontSize: 24,
                  transform: "rotate(-3deg)",
                  background: "var(--red)",
                  color: "var(--paper)",
                  padding: "6px 16px",
                  boxShadow: "4px 4px 0 #000",
                }}
              >
                VIP
              </div>
              <h2 style={{ margin: 0, fontFamily: sectionHeading, color: "var(--paper)", fontSize: 38, letterSpacing: 1 }}>
                FRONT ROW <span style={{ color: "var(--yellow)" }}>/ FEATURED</span>
              </h2>
              <div style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg, var(--red) 0 12px, transparent 12px 22px)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 28 }}>
              {vip.map((room) => (
                <RoomCard key={room.id} room={room} featured saved={isSaved(room.id)} onToggleSave={toggle} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ALL ROOMS */}
      <section style={{ position: "relative", background: "var(--paper2)", padding: "36px 28px 60px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontFamily: sectionHeading, fontSize: 32, letterSpacing: 1 }}>ALL ROOMS</h2>
            <span style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 13, background: "var(--ink)", color: "var(--paper)", padding: "4px 10px" }}>
              {regular.length} LISTED
            </span>
            <div style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg, var(--ink) 0 12px, transparent 12px 22px)" }} />
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", border: "3px dashed var(--ink)", background: "var(--paper)" }}>
              <div style={{ fontFamily: sectionHeading, fontSize: 42, transform: "rotate(-2deg)" }}>NO ROOMS. ALL QUIET.</div>
              <p style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 15, margin: "12px 0 18px" }}>
                Nothing matches that search. Ease up on the filters.
              </p>
              <button
                onClick={resetFilters}
                style={{ fontFamily: sectionHeading, letterSpacing: 1, fontSize: 16, padding: "11px 20px", background: "var(--red)", color: "var(--paper)", border: 0, cursor: "pointer", boxShadow: "4px 4px 0 var(--ink)" }}
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 26 }}>
              {regular.map((room) => (
                <RoomCard key={room.id} room={room} saved={isSaved(room.id)} onToggleSave={toggle} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "var(--font-anton), sans-serif", letterSpacing: 1, fontSize: 13, background: "var(--ink)", color: "var(--paper)", padding: "4px 9px" }}>
        {label}
      </span>
      {children}
    </div>
  );
}
