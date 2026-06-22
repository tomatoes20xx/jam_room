"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Genre, PriceTier, RoomInput, Soundproofing } from "@jamroom/shared";
import { GENRES, SOUNDPROOFING } from "@jamroom/shared";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { chipStyle } from "@/lib/design";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { AuthField } from "@/components/AuthField";
import { PhotoUploader, type UploadedPhoto } from "@/components/PhotoUploader";
import { useT } from "@/lib/i18n";

const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

export default function NewRoomPage() {
  const { t } = useT();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  const [pRoom, setPRoom] = useState("");
  const [pAddr, setPAddr] = useState("");
  const [pHood, setPHood] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCap, setPCap] = useState("");
  const [pHours, setPHours] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [proof, setProof] = useState<Soundproofing>("Full isolation");
  const [genres, setGenres] = useState<Genre[]>(["PUNK", "METAL"]);
  const [equip, setEquip] = useState<string[]>([""]);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleGenre = (g: Genre) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const priceTierFromNum = (n: number): PriceTier => (n <= 22 ? "$" : n <= 38 ? "$$" : "$$$");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const priceNum = parseInt(pPrice, 10) || 0;
    const input: RoomInput = {
      name: pRoom,
      neighborhood: pHood,
      address: pAddr,
      lat: 41.7151,
      lng: 44.8271,
      priceTier: priceTierFromNum(priceNum),
      priceNum,
      capacity: pCap || undefined,
      roomSize: pCap || "Medium",
      soundproof: proof,
      hours: pHours || "Hours TBD",
      open: true,
      genres,
      overview: pDesc.slice(0, 160) || `${pRoom} in ${pHood}`,
      longOverview: pDesc,
      gear: equip.filter(Boolean).length ? [{ title: "BACKLINE", items: equip.filter(Boolean) }] : [],
      images: photos.map((p) => ({ url: p.url, key: p.key, label: "ROOM" })),
    };
    try {
      await api.createRoom(input);
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : t("dash.load_error"));
      setBusy(false);
      return;
    }
    router.push("/dashboard");
  };

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
              {t("newroom.title_pre")} <span style={{ color: "var(--red)" }}>{t("newroom.title_accent")}</span>
            </h1>
            <p style={{ fontFamily: elite, fontSize: 15, margin: "14px 0 0" }}>{t("newroom.subtitle")}</p>
          </div>
        </section>

        <section style={{ background: "var(--paper2)", padding: "38px 28px 70px", minHeight: "50vh" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            {isPending ? null : !session ? (
              <Guard text={t("newroom.signin")} cta={t("nav.signin")} href="/login" />
            ) : role !== "PROVIDER" ? (
              <Guard text={t("newroom.not_provider")} cta={t("dash.view")} href="/" />
            ) : (
              <form onSubmit={submit} style={{ background: "var(--paper)", border: "3px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)", padding: "28px 30px 34px" }}>
                {error && (
                  <div style={{ marginBottom: 18, color: "var(--paper)", background: "var(--red)", fontFamily: elite, fontSize: 13, padding: "10px 14px", border: "2px solid var(--ink)" }}>
                    {error}
                  </div>
                )}

                <SectionLabel>{t("signup.sec_basics")}</SectionLabel>
                <AuthField label={t("signup.field_room_name")} value={pRoom} onChange={(e) => setPRoom(e.target.value)} placeholder="The Cellar" required />

                <SectionLabel small>{t("signup.sec_space")}</SectionLabel>
                <Grid cols="2fr 1fr">
                  <AuthField label={t("signup.field_address")} value={pAddr} onChange={(e) => setPAddr(e.target.value)} placeholder={t("signup.ph_address")} required />
                  <AuthField label={t("signup.field_neighborhood")} value={pHood} onChange={(e) => setPHood(e.target.value)} placeholder={t("signup.ph_neighborhood")} required />
                </Grid>
                <div style={{ marginTop: 18 }}>
                  <Grid cols="1fr 1fr 1fr">
                    <AuthField label={t("signup.field_rate")} value={pPrice} onChange={(e) => setPPrice(e.target.value)} placeholder="30" inputMode="numeric" required />
                    <AuthField label={t("signup.field_capacity")} value={pCap} onChange={(e) => setPCap(e.target.value)} placeholder={t("signup.ph_capacity")} />
                    <AuthField label={t("signup.field_hours")} value={pHours} onChange={(e) => setPHours(e.target.value)} placeholder={t("signup.ph_hours")} />
                  </Grid>
                </div>
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: elite, fontSize: 12, opacity: 0.7 }}>{t("signup.soundproofing")}</span>
                  {SOUNDPROOFING.map((s) => (
                    <button key={s} type="button" style={chipStyle(proof === s)} onClick={() => setProof(s)}>
                      {t(`soundproof.${s}`)}
                    </button>
                  ))}
                </div>

                <SectionLabel small>{t("signup.sec_gear")}</SectionLabel>
                <label style={{ fontFamily: anton, letterSpacing: 1, fontSize: 13, marginBottom: 9, display: "block" }}>
                  {t("signup.equipment")} <span style={{ fontFamily: elite, fontSize: 11, opacity: 0.6, letterSpacing: 0 }}>{t("signup.equipment_hint")}</span>
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {equip.map((v, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ color: "var(--red)", fontSize: 18 }}>▸</span>
                      <input
                        value={v}
                        onChange={(e) => setEquip((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                        placeholder={t("signup.gear_placeholder")}
                        style={{ flex: 1, border: "3px solid var(--ink)", background: "var(--paper)", fontFamily: elite, fontSize: 14, padding: "10px 13px", color: "var(--ink)", outline: "none" }}
                      />
                      <button
                        type="button"
                        onClick={() => setEquip((prev) => prev.filter((_, j) => j !== i))}
                        style={{ cursor: "pointer", width: 42, height: 42, flex: "none", border: "3px solid var(--ink)", background: "var(--paper)", color: "var(--ink)", fontFamily: anton, fontSize: 20, lineHeight: 1 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setEquip((prev) => [...prev, ""])}
                  style={{ marginTop: 12, cursor: "pointer", fontFamily: anton, letterSpacing: 1, fontSize: 13, padding: "9px 15px", background: "var(--ink)", color: "var(--paper)", border: 0, boxShadow: "3px 3px 0 var(--red)" }}
                >
                  {t("signup.add_gear")}
                </button>

                <label style={{ fontFamily: anton, letterSpacing: 1, fontSize: 13, margin: "24px 0 9px", display: "block" }}>{t("signup.genres")}</label>
                <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                  {GENRES.map((g) => (
                    <button key={g} type="button" style={chipStyle(genres.includes(g))} onClick={() => toggleGenre(g)}>
                      {g}
                    </button>
                  ))}
                </div>

                <SectionLabel small>{t("signup.sec_photos")}</SectionLabel>
                <PhotoUploader photos={photos} onChange={setPhotos} />

                <SectionLabel small>{t("signup.sec_pitch")}</SectionLabel>
                <textarea
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder={t("signup.pitch_placeholder")}
                  style={{ width: "100%", minHeight: 120, resize: "vertical", border: "3px solid var(--ink)", background: "var(--paper)", fontFamily: elite, fontSize: 14, lineHeight: 1.5, padding: 14, color: "var(--ink)", outline: "none" }}
                />

                <button
                  type="submit"
                  disabled={busy}
                  style={{ marginTop: 28, width: "100%", cursor: "pointer", fontFamily: anton, letterSpacing: 1.5, fontSize: 20, padding: 16, background: "var(--red)", color: "var(--paper)", border: 0, boxShadow: "6px 6px 0 var(--ink)", opacity: busy ? 0.6 : 1 }}
                >
                  {busy ? "…" : t("signup.list_room")}
                </button>
              </form>
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

function SectionLabel({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: small ? "26px 0 18px" : "0 0 22px" }}>
      <span style={{ fontFamily: anton, fontSize: small ? 19 : 24, letterSpacing: 1, background: "var(--ink)", color: "var(--paper)", padding: small ? "4px 11px" : "5px 12px" }}>
        {children}
      </span>
      <span style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg, var(--ink) 0 10px, transparent 10px 18px)" }} />
    </div>
  );
}

function Grid({ cols, children }: { cols: string; children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: cols, gap: 18 }}>{children}</div>;
}
