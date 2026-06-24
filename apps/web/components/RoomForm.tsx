"use client";

import { useState } from "react";
import type { Genre, PriceTier, RoomDetail, RoomInput, Soundproofing } from "@jamroom/shared";
import { GENRES, SOUNDPROOFING } from "@jamroom/shared";
import { api } from "@/lib/api";
import { uploadFiles } from "@/lib/uploadthing";
import { chipStyle } from "@/lib/design";
import { AuthField } from "@/components/AuthField";
import { PhotoUploader, type PendingPhoto } from "@/components/PhotoUploader";
import { PhoneField, toFullPhone } from "@/components/PhoneField";
import { useT } from "@/lib/i18n";

const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

/** Existing, already-uploaded image kept on an edited room. */
type KeptImage = { id: string; url: string; key: string; label: string };

const priceTierFromNum = (n: number): PriceTier => (n <= 22 ? "$" : n <= 38 ? "$$" : "$$$");

/** Local 9-digit subscriber number from a stored "+995 123 12 32 52" value. */
function localPhone(full: string | null | undefined): string {
  return (full ?? "").replace(/\D/g, "").replace(/^995/, "").slice(0, 9);
}

/** Split stored hours like "10:00 – 02:00" back into the two pickers. */
function splitHours(hours: string | undefined): [string, string] {
  const m = (hours ?? "").match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  return m ? [m[1], m[2]] : ["", ""];
}

export function RoomForm({
  mode,
  initial,
  onSaved,
}: {
  mode: "create" | "edit";
  initial?: RoomDetail;
  onSaved: (room: RoomDetail) => void;
}) {
  const { t } = useT();
  const initHours = splitHours(initial?.hours);

  const [pRoom, setPRoom] = useState(initial?.name ?? "");
  const [pAddr, setPAddr] = useState(initial?.address ?? "");
  const [pHood, setPHood] = useState(initial?.neighborhood ?? "");
  const [pPhone, setPPhone] = useState(localPhone(initial?.phone));
  const [pPrice, setPPrice] = useState(initial ? String(initial.priceNum) : "");
  const [pCap, setPCap] = useState(initial?.capacity?.match(/\d+/)?.[0] ?? "");
  const [pHoursFrom, setPHoursFrom] = useState(initHours[0]);
  const [pHoursTo, setPHoursTo] = useState(initHours[1]);
  const [pDesc, setPDesc] = useState(initial?.longOverview ?? "");
  const [proof, setProof] = useState<Soundproofing>(initial?.soundproof ?? "Full isolation");
  const [genres, setGenres] = useState<Genre[]>(
    (initial?.genres as Genre[]) ?? ["PUNK", "METAL"],
  );
  const [equip, setEquip] = useState<string[]>(() => {
    const items = initial?.gear.flatMap((g) => g.items) ?? [];
    return items.length ? items : [""];
  });
  const [keptImages, setKeptImages] = useState<KeptImage[]>(
    initial?.images.map((i) => ({ id: i.id, url: i.url, key: i.key, label: i.label })) ?? [],
  );
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleGenre = (g: Genre) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pPhone.length !== 9) {
      setError(t("signup.err_phone"));
      return;
    }
    setBusy(true);
    setError(null);
    const priceNum = parseInt(pPrice, 10) || 0;
    const pHours = pHoursFrom && pHoursTo ? `${pHoursFrom} – ${pHoursTo}` : "";
    try {
      // Upload newly-picked photos only on submit, so abandoning the form never
      // leaves orphaned files in uploadthing.
      const uploaded = photos.length
        ? await uploadFiles("roomImage", { files: photos.map((p) => p.file) })
        : [];
      const newImages = uploaded.map((f) => {
        const file = f as { ufsUrl?: string; url: string; key: string };
        return { url: file.ufsUrl ?? file.url, key: file.key, label: "ROOM" };
      });
      const input: RoomInput = {
        name: pRoom,
        neighborhood: pHood,
        address: pAddr,
        phone: toFullPhone(pPhone),
        lat: initial?.lat ?? 41.7151,
        lng: initial?.lng ?? 44.8271,
        priceTier: priceTierFromNum(priceNum),
        priceNum,
        capacity: pCap || undefined,
        roomSize: pCap || "Medium",
        soundproof: proof,
        hours: pHours || "Hours TBD",
        open: initial?.open ?? true,
        genres,
        overview: pDesc.slice(0, 160) || `${pRoom} in ${pHood}`,
        longOverview: pDesc,
        gear: equip.filter(Boolean).length ? [{ title: "BACKLINE", items: equip.filter(Boolean) }] : [],
        images: [
          ...keptImages.map((i) => ({ url: i.url, key: i.key, label: i.label })),
          ...newImages,
        ],
      };
      const room = mode === "edit" && initial ? await api.updateRoom(initial.id, input) : await api.createRoom(input);
      onSaved(room);
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : t("dash.load_error"));
      setBusy(false);
    }
  };

  return (
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
        <PhoneField label={t("signup.field_phone")} value={pPhone} onChange={setPPhone} required />
      </div>
      <div style={{ marginTop: 18 }}>
        <Grid cols="1fr 1fr 1fr 1fr">
          <AuthField label={t("signup.field_rate")} value={pPrice} onChange={(e) => setPPrice(e.target.value)} placeholder="30" type="number" min={0} step={1} inputMode="numeric" required />
          <AuthField label={t("signup.field_capacity")} value={pCap} onChange={(e) => setPCap(e.target.value)} placeholder={t("signup.ph_capacity")} type="number" min={0} step={1} inputMode="numeric" />
          <TimeField label={t("signup.hours_from")} value={pHoursFrom} onChange={setPHoursFrom} placeholder={t("signup.pick_time")} />
          <TimeField label={t("signup.hours_to")} value={pHoursTo} onChange={setPHoursTo} placeholder={t("signup.pick_time")} />
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
              style={{ flex: 1, minWidth: 0, border: "3px solid var(--ink)", background: "var(--paper)", fontFamily: elite, fontSize: 14, padding: "10px 13px", color: "var(--ink)", outline: "none" }}
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
      {keptImages.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 16 }}>
          {keptImages.map((img) => (
            <div
              key={img.id}
              style={{ position: "relative", aspectRatio: "4/3", border: "3px solid var(--ink)", background: `center/cover no-repeat url(${img.url})`, boxShadow: "4px 4px 0 var(--ink)" }}
            >
              <button
                type="button"
                onClick={() => setKeptImages((prev) => prev.filter((x) => x.id !== img.id))}
                style={{ position: "absolute", top: 6, right: 6, width: 28, height: 28, border: "2px solid var(--ink)", background: "var(--paper)", color: "var(--ink)", fontFamily: anton, fontSize: 16, cursor: "pointer", lineHeight: 1 }}
                aria-label={t("photo.remove")}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <PhotoUploader photos={photos} onChange={setPhotos} disabled={busy} />

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
        {busy ? "…" : mode === "edit" ? t("editroom.save") : t("signup.list_room")}
      </button>
    </form>
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
  return (
    <div className="jr-form-grid" style={{ "--cols": cols } as React.CSSProperties}>
      {children}
    </div>
  );
}

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

function TimeField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label style={{ fontFamily: anton, letterSpacing: 1, fontSize: 13, marginBottom: 7, display: "block" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            border: "3px solid var(--ink)",
            background: "var(--paper)",
            fontFamily: elite,
            fontSize: 15,
            padding: "12px 38px 12px 14px",
            color: value ? "var(--ink)" : "rgba(0,0,0,0.45)",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            borderRadius: 0,
          }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot} style={{ color: "var(--ink)" }}>
              {slot}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--ink)",
            fontSize: 11,
          }}
        >
          ▼
        </span>
      </div>
    </div>
  );
}
