import type { CSSProperties } from "react";

/** ★ rating string, ported from the design's stars() helper. */
export function stars(rating: number): string {
  const f = Math.round(rating);
  return "★★★★★".slice(0, f) + "☆☆☆☆☆".slice(0, 5 - f);
}

/** Deterministic tint per room id (ported from design tints()). */
const TINTS = ["#3a2f4f", "#4a2f2f", "#2f4a3e", "#43391f", "#2f3a4a", "#4a3f2f"];
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
export function tintFor(id: string): string {
  return TINTS[Math.abs(hash(id)) % TINTS.length]!;
}
export function rotateFor(name: string): number {
  return ((hash(name) % 3) - 1) * 0.5;
}

export function chipStyle(active: boolean): CSSProperties {
  return {
    cursor: "pointer",
    fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif",
    letterSpacing: "1px",
    fontSize: "13px",
    padding: "6px 12px",
    border: "2px solid var(--ink)",
    transition: "transform .05s",
    ...(active
      ? { background: "var(--red)", color: "var(--paper)", boxShadow: "3px 3px 0 var(--ink)", transform: "translate(-1px,-1px)" }
      : { background: "var(--paper)", color: "var(--ink)" }),
  };
}

export function cardStyle(vip: boolean): CSSProperties {
  return {
    position: "relative",
    cursor: "pointer",
    background: "var(--paper)",
    border: "3px solid var(--ink)",
    overflow: "visible",
    transition: "transform .08s, box-shadow .08s",
    ...(vip
      ? { boxShadow: "7px 7px 0 var(--red)", transform: "rotate(-0.6deg)" }
      : { boxShadow: "5px 5px 0 var(--ink)" }),
  };
}

export function thumbStyle(tint: string, image?: string | null): CSSProperties {
  const base: CSSProperties = {
    position: "relative",
    height: "150px",
    borderBottom: "3px solid var(--ink)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: "8px",
  };
  if (image) {
    return { ...base, backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" };
  }
  return {
    ...base,
    background: tint,
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(0,0,0,.14) 0 2px, transparent 2px 14px), radial-gradient(rgba(0,0,0,.35) 1.3px, transparent 1.5px)",
    backgroundSize: "auto, 8px 8px",
  };
}

export function openBadgeStyle(open: boolean): CSSProperties {
  return {
    fontFamily: "var(--font-anton), var(--font-anton-ge), sans-serif",
    fontSize: "11px",
    letterSpacing: "1px",
    padding: "3px 8px",
    color: open ? "var(--ink)" : "var(--paper)",
    background: open ? "var(--yellow)" : "#7a1414",
    border: "2px solid var(--ink)",
  };
}

export function saveStyle(saved: boolean): CSSProperties {
  return {
    position: "absolute",
    top: "8px",
    left: "8px",
    zIndex: 4,
    width: "34px",
    height: "34px",
    border: "2px solid var(--ink)",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: 1,
    ...(saved ? { background: "var(--red)", color: "var(--paper)" } : { background: "var(--paper)", color: "var(--ink)" }),
  };
}
