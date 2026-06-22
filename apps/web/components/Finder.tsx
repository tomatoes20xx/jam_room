"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Genre, PriceTier, RoomCard as RoomCardType, RoomListQuery, RoomSort } from "@jamroom/shared";
import { api } from "@/lib/api";
import { chipStyle } from "@/lib/design";
import { useSaved } from "@/lib/useSaved";
import { useT } from "@/lib/i18n";
import { RoomCard } from "./RoomCard";

const GENRES = ["ALL", "PUNK", "METAL", "HARDCORE", "INDIE", "ROCK", "GARAGE", "HIP-HOP", "NOISE", "JAZZ"];
const PRICES: (PriceTier | "ALL")[] = ["ALL", "$", "$$", "$$$"];
const SORTS: [RoomSort, string][] = [
  ["rating", "finder.sort_rating"],
  ["price", "finder.sort_price"],
  ["name", "finder.sort_name"],
];
const PAGE = 12;

export function Finder({ initialRooms, initialTotal }: { initialRooms: RoomCardType[]; initialTotal: number }) {
  const { t } = useT();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [price, setPrice] = useState<PriceTier | null>(null);
  const [openNow, setOpenNow] = useState(false);
  const [sort, setSort] = useState<RoomSort>("rating");
  const { isSaved, toggle } = useSaved();

  // Filtering/sorting/paging now happen on the server. We hold the current page
  // of results and the total match count, refetching whenever filters change.
  const [rooms, setRooms] = useState<RoomCardType[]>(initialRooms);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  // Debounce the free-text query so we don't hit the API on every keystroke.
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const buildQuery = useCallback(
    (offset: number): Partial<RoomListQuery> => ({
      q: debouncedQuery.trim() || undefined,
      genre: (genre ?? undefined) as Genre | undefined,
      priceTier: price ?? undefined,
      openNow: openNow || undefined,
      sort,
      limit: PAGE,
      offset,
    }),
    [debouncedQuery, genre, price, openNow, sort],
  );

  // Refetch the first page whenever any filter changes. The initial SSR page is
  // already in state, so skip the very first run to avoid a duplicate request.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .listRooms(buildQuery(0))
      .then((res) => {
        if (cancelled) return;
        setRooms(res.rooms);
        setTotal(res.total);
      })
      .catch(() => {
        if (cancelled) return;
        setRooms([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [buildQuery]);

  const loadMore = () => {
    setLoading(true);
    api
      .listRooms(buildQuery(rooms.length))
      .then((res) => setRooms((prev) => [...prev, ...res.rooms]))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const vip = rooms.filter((p) => p.vip);
  const regular = rooms.filter((p) => !p.vip);
  const hasMore = rooms.length < total;

  const resetFilters = () => {
    setQuery("");
    setGenre(null);
    setPrice(null);
    setOpenNow(false);
  };

  const sectionHeading = "var(--font-anton), var(--font-anton-ge), sans-serif";

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
              {t("finder.count", { count: total })}
            </div>
          </div>

          {/* search bar */}
          <div style={{ marginTop: 42, display: "flex", flexWrap: "wrap", boxShadow: "7px 7px 0 var(--ink)", maxWidth: 760, border: "3px solid var(--ink)" }}>
            <div style={{ background: "var(--ink)", color: "var(--paper)", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 22 }}>⌕</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("finder.search")}
              style={{
                flex: "1 1 200px",
                minWidth: 0,
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
                flex: "1 1 120px",
                border: 0,
                borderLeft: "3px solid var(--ink)",
                background: "var(--red)",
                color: "var(--paper)",
                fontFamily: sectionHeading,
                letterSpacing: 1,
                fontSize: 16,
                padding: "12px 22px",
                cursor: "pointer",
              }}
            >
              {t("finder.clear")}
            </button>
          </div>

          {/* filters */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            <FilterRow label={t("finder.genre")}>
              {GENRES.map((g) => {
                const active = g === "ALL" ? !genre : genre === g;
                return (
                  <button key={g} style={chipStyle(active)} onClick={() => setGenre(g === "ALL" ? null : g)}>
                    {g === "ALL" ? t("finder.all") : g}
                  </button>
                );
              })}
            </FilterRow>
            <FilterRow label={t("finder.price")}>
              {PRICES.map((p) => {
                const active = p === "ALL" ? !price : price === p;
                return (
                  <button key={p} style={chipStyle(active)} onClick={() => setPrice(p === "ALL" ? null : (p as PriceTier))}>
                    {p === "ALL" ? t("finder.all") : p}
                  </button>
                );
              })}
              <span style={{ width: 2, height: 26, background: "var(--ink)", opacity: 0.3, margin: "0 4px" }} />
              <button style={chipStyle(openNow)} onClick={() => setOpenNow((v) => !v)}>
                <span style={{ fontSize: 15 }}>●</span> {t("finder.open_now")}
              </button>
            </FilterRow>
            <FilterRow label={t("finder.sort")}>
              {SORTS.map(([k, l]) => (
                <button key={k} style={chipStyle(sort === k)} onClick={() => setSort(k)}>
                  {t(l)}
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
                {t("finder.front_row")} <span style={{ color: "var(--yellow)" }}>{t("finder.featured")}</span>
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
            <h2 style={{ margin: 0, fontFamily: sectionHeading, fontSize: 32, letterSpacing: 1 }}>{t("finder.all_rooms")}</h2>
            <span style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 13, background: "var(--ink)", color: "var(--paper)", padding: "4px 10px" }}>
              {t("finder.listed", { count: regular.length })}
            </span>
            <div style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg, var(--ink) 0 12px, transparent 12px 22px)" }} />
          </div>

          {rooms.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", border: "3px dashed var(--ink)", background: "var(--paper)" }}>
              <div style={{ fontFamily: sectionHeading, fontSize: 42, transform: "rotate(-2deg)" }}>{t("finder.empty_title")}</div>
              <p style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 15, margin: "12px 0 18px" }}>
                {t("finder.empty_body")}
              </p>
              <button
                onClick={resetFilters}
                style={{ fontFamily: sectionHeading, letterSpacing: 1, fontSize: 16, padding: "11px 20px", background: "var(--red)", color: "var(--paper)", border: 0, cursor: "pointer", boxShadow: "4px 4px 0 var(--ink)" }}
              >
                {t("finder.reset")}
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 26 }}>
                {regular.map((room) => (
                  <RoomCard key={room.id} room={room} saved={isSaved(room.id)} onToggleSave={toggle} />
                ))}
              </div>
              {hasMore && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    style={{ fontFamily: sectionHeading, letterSpacing: 1, fontSize: 16, padding: "13px 26px", background: "var(--ink)", color: "var(--paper)", border: 0, cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1, boxShadow: "5px 5px 0 var(--red)" }}
                  >
                    {loading ? t("finder.loading") : t("finder.load_more")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif", letterSpacing: 1, fontSize: 13, background: "var(--ink)", color: "var(--paper)", padding: "4px 9px" }}>
        {label}
      </span>
      {children}
    </div>
  );
}
