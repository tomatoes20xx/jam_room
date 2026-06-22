"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Genre, PriceTier, RoomInput, Soundproofing } from "@jamroom/shared";
import { GENRES, SOUNDPROOFING } from "@jamroom/shared";
import { signUp } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { chipStyle } from "@/lib/design";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { GoogleButton } from "@/components/GoogleButton";
import { AuthField } from "@/components/AuthField";
import { PhotoUploader, type UploadedPhoto } from "@/components/PhotoUploader";

const anton = "var(--font-anton), sans-serif";
const elite = "var(--font-special-elite), monospace";

type Tab = "user" | "provider";

export default function SignupPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("user");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // musician
  const [uEmail, setUEmail] = useState("");
  const [uName, setUName] = useState("");
  const [uPass, setUPass] = useState("");

  // provider
  const [pRoom, setPRoom] = useState("");
  const [pName, setPName] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pPass, setPPass] = useState("");
  const [pAddr, setPAddr] = useState("");
  const [pHood, setPHood] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCap, setPCap] = useState("");
  const [pHours, setPHours] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [proof, setProof] = useState<Soundproofing>("Full isolation");
  const [genres, setGenres] = useState<Genre[]>(["PUNK", "METAL"]);
  const [equip, setEquip] = useState<string[]>([
    "Tama Imperialstar 5-pc drums",
    "Marshall JCM800 + 4x12",
    "Ampeg SVT-CL + 8x10 fridge",
  ]);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);

  const toggleGenre = (g: Genre) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const priceTierFromNum = (n: number): PriceTier => (n <= 22 ? "$" : n <= 38 ? "$$" : "$$$");

  const submitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await signUp.email({
      email: uEmail,
      password: uPass,
      name: uName || uEmail,
      // additional fields registered on the server
      // @ts-expect-error better-auth additionalFields
      role: "MUSICIAN",
      displayName: uName,
    });
    setBusy(false);
    if (err) return setError(err.message ?? "Sign up failed");
    setDone(true);
  };

  const submitProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const priceNum = parseInt(pPrice, 10) || 0;
    const { error: err } = await signUp.email({
      email: pEmail,
      password: pPass,
      name: pName || pRoom,
      // @ts-expect-error better-auth additionalFields
      role: "PROVIDER",
      displayName: pName,
    });
    if (err) {
      setBusy(false);
      return setError(err.message ?? "Sign up failed");
    }
    // Create the room listing.
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
      gear: equip.filter(Boolean).length
        ? [{ title: "BACKLINE", items: equip.filter(Boolean) }]
        : [],
      images: photos.map((p) => ({ url: p.url, key: p.key, label: "ROOM" })),
    };
    try {
      await api.createRoom(input);
    } catch (e2) {
      // Account exists even if room creation failed; surface the issue.
      setError(e2 instanceof Error ? `Account created, but room save failed: ${e2.message}` : "Room save failed");
      setBusy(false);
      return;
    }
    setBusy(false);
    setDone(true);
  };

  if (done) {
    return (
      <Shell>
        <section style={{ background: "var(--paper)", borderBottom: "4px solid var(--ink)", padding: "80px 28px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-block", fontFamily: "var(--font-permanent-marker), cursive", fontSize: 22, background: "var(--yellow)", color: "var(--ink)", padding: "6px 18px", transform: "rotate(-3deg)", border: "2px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)" }}>
              you&apos;re in
            </div>
            <h1 style={{ margin: "26px 0 0", fontFamily: anton, fontSize: "clamp(44px,8vw,84px)", lineHeight: 0.9, letterSpacing: 1, textTransform: "uppercase" }}>
              {tab === "user" ? "LET’S GET LOUD." : "ROOM IS LIVE."}
            </h1>
            <p style={{ fontFamily: elite, fontSize: 16, lineHeight: 1.6, margin: "18px 0 30px" }}>
              {tab === "user"
                ? "Your account is set. Start digging through Tbilisi’s rehearsal rooms and book your first slot."
                : "Your listing is live. Bands can find you, message you, and book by the hour."}
            </p>
            <button
              onClick={() => router.push("/")}
              style={{ cursor: "pointer", fontFamily: anton, letterSpacing: 1, fontSize: 17, padding: "13px 24px", background: "var(--red)", color: "var(--paper)", border: 0, boxShadow: "5px 5px 0 var(--ink)" }}
            >
              → BROWSE ROOMS
            </button>
          </div>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <section style={{ background: "var(--paper)", borderBottom: "4px solid var(--ink)", padding: "40px 28px 30px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontFamily: anton, fontSize: "clamp(40px,6.5vw,80px)", lineHeight: 0.9, letterSpacing: 1, textTransform: "uppercase", maxWidth: 680 }}>
              Join the
              <br />
              <span style={{ color: "var(--paper)", background: "var(--red)", padding: "2px 12px", display: "inline-block", transform: "rotate(-1.5deg)", boxShadow: "4px 4px 0 #000", marginTop: 8 }}>
                racket.
              </span>
            </h1>
            <div style={{ fontFamily: elite, fontSize: 14, maxWidth: 250, lineHeight: 1.5, border: "2px solid var(--ink)", padding: "10px 12px", transform: "rotate(1deg)", background: "var(--yellow)" }}>
              Pick your side of the glass. Takes two minutes. Costs nothing.
            </div>
          </div>

          {/* tabs */}
          <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <TabButton active={tab === "user"} onClick={() => setTab("user")} title="I'M A MUSICIAN" sub="Find rooms · book slots · save favorites" />
            <TabButton active={tab === "provider"} onClick={() => setTab("provider")} title="I RUN A ROOM" sub="List your space · set rates · take bookings" />
          </div>
        </div>
      </section>

      <section style={{ background: "var(--paper2)", padding: "38px 28px 70px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          {error && (
            <div style={{ maxWidth: 520, margin: "0 auto 18px", color: "var(--paper)", background: "var(--red)", fontFamily: elite, fontSize: 13, padding: "10px 14px", border: "2px solid var(--ink)" }}>
              {error}
            </div>
          )}

          {tab === "user" ? (
            <form onSubmit={submitUser} style={{ maxWidth: 520, margin: "0 auto", background: "var(--paper)", border: "3px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)", padding: "28px 28px 32px" }}>
              <SectionLabel>QUICK START</SectionLabel>
              <GoogleButton label="SIGN UP WITH GOOGLE" />
              <Divider label="OR GO OLD-SCHOOL" />
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <AuthField label="EMAIL" type="email" value={uEmail} onChange={(e) => setUEmail(e.target.value)} placeholder="you@band.ge" required />
                <AuthField label="USERNAME" value={uName} onChange={(e) => setUName(e.target.value)} placeholder="stagename_94" required />
                <AuthField label="PASSWORD" type="password" value={uPass} onChange={(e) => setUPass(e.target.value)} placeholder="••••••••" required />
              </div>
              <SubmitButton busy={busy}>CREATE ACCOUNT →</SubmitButton>
              <SignInHint />
            </form>
          ) : (
            <form onSubmit={submitProvider} style={{ background: "var(--paper)", border: "3px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)", padding: "28px 30px 34px" }}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontFamily: elite, fontSize: 13 }}>
                  List your space. <span style={{ opacity: 0.7 }}>All fields help bands find you.</span>
                </div>
                <GoogleButton compact label="CONTINUE WITH GOOGLE" />
              </div>

              <SectionLabel small>01 · THE BASICS</SectionLabel>
              <Grid cols="1fr 1fr">
                <AuthField label="ROOM / VENUE NAME" value={pRoom} onChange={(e) => setPRoom(e.target.value)} placeholder="The Cellar" required />
                <AuthField label="YOUR NAME" value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Dato K." required />
                <AuthField label="EMAIL" type="email" value={pEmail} onChange={(e) => setPEmail(e.target.value)} placeholder="booking@cellar.ge" required />
                <AuthField label="PASSWORD" type="password" value={pPass} onChange={(e) => setPPass(e.target.value)} placeholder="••••••••" required />
              </Grid>

              <SectionLabel small>02 · THE SPACE</SectionLabel>
              <Grid cols="2fr 1fr">
                <AuthField label="STREET ADDRESS" value={pAddr} onChange={(e) => setPAddr(e.target.value)} placeholder="12 Asatiani St, Tbilisi" required />
                <AuthField label="NEIGHBORHOOD" value={pHood} onChange={(e) => setPHood(e.target.value)} placeholder="Sololaki" required />
              </Grid>
              <div style={{ marginTop: 18 }}>
                <Grid cols="1fr 1fr 1fr">
                  <AuthField label="RATE (₾/HR)" value={pPrice} onChange={(e) => setPPrice(e.target.value)} placeholder="30" inputMode="numeric" required />
                  <AuthField label="CAPACITY" value={pCap} onChange={(e) => setPCap(e.target.value)} placeholder="12 people" />
                  <AuthField label="HOURS" value={pHours} onChange={(e) => setPHours(e.target.value)} placeholder="10am – 2am daily" />
                </Grid>
              </div>
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: elite, fontSize: 12, opacity: 0.7 }}>SOUNDPROOFING:</span>
                {SOUNDPROOFING.map((s) => (
                  <button key={s} type="button" style={chipStyle(proof === s)} onClick={() => setProof(s)}>
                    {s}
                  </button>
                ))}
              </div>

              <SectionLabel small>03 · THE GEAR</SectionLabel>
              <label style={{ fontFamily: anton, letterSpacing: 1, fontSize: 13, marginBottom: 9, display: "block" }}>
                EQUIPMENT LIST <span style={{ fontFamily: elite, fontSize: 11, opacity: 0.6, letterSpacing: 0 }}>— what bands can plug into</span>
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {equip.map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ color: "var(--red)", fontSize: 18 }}>▸</span>
                    <input
                      value={v}
                      onChange={(e) => setEquip((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                      placeholder="e.g. Marshall JCM800 head"
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
                + ADD GEAR
              </button>

              <label style={{ fontFamily: anton, letterSpacing: 1, fontSize: 13, margin: "24px 0 9px", display: "block" }}>GENRES YOU CATER TO</label>
              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                {GENRES.map((g) => (
                  <button key={g} type="button" style={chipStyle(genres.includes(g))} onClick={() => toggleGenre(g)}>
                    {g}
                  </button>
                ))}
              </div>

              <SectionLabel small>04 · THE PHOTOS</SectionLabel>
              <PhotoUploader photos={photos} onChange={setPhotos} />

              <SectionLabel small>05 · THE PITCH</SectionLabel>
              <textarea
                value={pDesc}
                onChange={(e) => setPDesc(e.target.value)}
                placeholder="Tell bands what makes the room loud, weird and worth booking. Vibe, walls, backline — all of it."
                style={{ width: "100%", minHeight: 120, resize: "vertical", border: "3px solid var(--ink)", background: "var(--paper)", fontFamily: elite, fontSize: 14, lineHeight: 1.5, padding: 14, color: "var(--ink)", outline: "none" }}
              />

              <SubmitButton busy={busy} big>LIST MY ROOM →</SubmitButton>
              <SignInHint listed />
            </form>
          )}
        </div>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      <main style={{ position: "relative", zIndex: 2 }}>{children}</main>
      <Footer />
    </div>
  );
}

function TabButton({ active, onClick, title, sub }: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: "pointer",
        textAlign: "left",
        border: "3px solid var(--ink)",
        padding: "18px 20px",
        ...(active
          ? { background: "var(--ink)", color: "var(--paper)", boxShadow: "6px 6px 0 var(--red)", transform: "translate(-1px,-1px)" }
          : { background: "var(--paper)", color: "var(--ink)", boxShadow: "6px 6px 0 var(--ink)" }),
      }}
    >
      <div style={{ fontFamily: anton, fontSize: "clamp(22px,3vw,30px)", letterSpacing: 1, lineHeight: 1 }}>{title}</div>
      <div style={{ fontFamily: elite, fontSize: 12.5, marginTop: 6, opacity: 0.85 }}>{sub}</div>
    </button>
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

function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
      <span style={{ flex: 1, height: 2, background: "var(--ink)", opacity: 0.3 }} />
      <span style={{ fontFamily: elite, fontSize: 12, letterSpacing: 1 }}>{label}</span>
      <span style={{ flex: 1, height: 2, background: "var(--ink)", opacity: 0.3 }} />
    </div>
  );
}

function Grid({ cols, children }: { cols: string; children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: cols, gap: 18 }}>{children}</div>;
}

function SubmitButton({ children, busy, big }: { children: React.ReactNode; busy: boolean; big?: boolean }) {
  return (
    <button
      type="submit"
      disabled={busy}
      style={{ marginTop: big ? 28 : 26, width: "100%", cursor: "pointer", fontFamily: anton, letterSpacing: 1.5, fontSize: big ? 20 : 19, padding: big ? 16 : 15, background: "var(--red)", color: "var(--paper)", border: 0, boxShadow: big ? "6px 6px 0 var(--ink)" : "5px 5px 0 var(--ink)", opacity: busy ? 0.6 : 1 }}
    >
      {busy ? "…" : children}
    </button>
  );
}

function SignInHint({ listed }: { listed?: boolean }) {
  return (
    <div style={{ textAlign: "center", marginTop: 18, fontFamily: elite, fontSize: 13 }}>
      {listed ? "Already listed? " : "Already in the scene? "}
      <Link href="/login" style={{ color: "var(--ink)", borderBottom: "3px solid var(--red)", fontFamily: anton, letterSpacing: 1, textDecoration: "none" }}>
        SIGN IN
      </Link>
    </div>
  );
}
