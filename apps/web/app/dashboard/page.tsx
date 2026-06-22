"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { RoomCard as RoomCardType } from "@jamroom/shared";
import { api } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import { stars } from "@/lib/design";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";

const anton = "var(--font-anton), sans-serif";
const elite = "var(--font-special-elite), monospace";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [rooms, setRooms] = useState<RoomCardType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    api
      .myRooms()
      .then(setRooms)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load your rooms"));
  }, [session]);

  const remove = async (id: string) => {
    if (!confirm("Delete this room listing?")) return;
    await api.deleteRoom(id).catch(() => {});
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      <main style={{ background: "var(--paper2)", padding: "40px 28px 70px", minHeight: "50vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontFamily: anton, fontSize: 40, letterSpacing: 1, textTransform: "uppercase" }}>
              Your <span style={{ color: "var(--red)" }}>rooms.</span>
            </h1>
            <div style={{ flex: 1, height: 3, background: "repeating-linear-gradient(90deg, var(--ink) 0 12px, transparent 12px 22px)" }} />
            {session && (
              <button onClick={() => signOut()} style={{ cursor: "pointer", fontFamily: anton, letterSpacing: 1, fontSize: 13, padding: "8px 14px", background: "var(--ink)", color: "var(--paper)", border: 0 }}>
                SIGN OUT
              </button>
            )}
          </div>

          {isPending ? null : !session ? (
            <Prompt text="Sign in as a room owner to manage your listings." cta="SIGN IN" href="/login" />
          ) : error ? (
            <Prompt text={error} cta="LIST A ROOM" href="/signup" />
          ) : rooms.length === 0 ? (
            <Prompt text="No rooms yet. List your first space." cta="LIST A ROOM" href="/signup" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {rooms.map((room) => (
                <div key={room.id} style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--paper)", border: "3px solid var(--ink)", boxShadow: "5px 5px 0 var(--ink)", padding: "14px 18px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: anton, fontSize: 22, letterSpacing: 0.5, textTransform: "uppercase" }}>{room.name}</div>
                    <div style={{ fontFamily: elite, fontSize: 13, marginTop: 4 }}>
                      {room.neighborhood} · ₾{room.priceNum}/hr · <span style={{ color: "var(--red)" }}>{stars(room.rating)}</span> ({room.reviewCount})
                    </div>
                  </div>
                  <Link href={`/rooms/${room.id}`} style={{ textDecoration: "none", fontFamily: anton, letterSpacing: 1, fontSize: 13, padding: "8px 14px", background: "var(--paper)", color: "var(--ink)", border: "2px solid var(--ink)" }}>
                    VIEW
                  </Link>
                  <button onClick={() => remove(room.id)} style={{ cursor: "pointer", fontFamily: anton, letterSpacing: 1, fontSize: 13, padding: "8px 14px", background: "var(--red)", color: "var(--paper)", border: 0 }}>
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Prompt({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", border: "3px dashed var(--ink)", background: "var(--paper)" }}>
      <p style={{ fontFamily: elite, fontSize: 15, margin: "0 0 18px" }}>{text}</p>
      <Link href={href} style={{ textDecoration: "none", fontFamily: anton, letterSpacing: 1, fontSize: 16, padding: "11px 20px", background: "var(--red)", color: "var(--paper)", boxShadow: "4px 4px 0 var(--ink)" }}>
        {cta}
      </Link>
    </div>
  );
}
