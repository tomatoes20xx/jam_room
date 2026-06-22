"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { useT } from "@/lib/i18n";

const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

function initialsOf(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { t } = useT();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/login");
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Masthead />
        <main style={{ background: "var(--paper2)", padding: "60px 28px", minHeight: "50vh" }} />
        <Footer />
      </div>
    );
  }

  const user = session.user as {
    name?: string | null;
    displayName?: string | null;
    email: string;
    image?: string | null;
    role?: string;
  };
  const label = user.displayName || user.name || user.email;
  const role = user.role === "PROVIDER" ? t("profile.role_owner") : t("profile.role_musician");

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      <main style={{ background: "var(--paper2)", padding: "50px 28px 70px", minHeight: "50vh" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* identity card */}
          <div style={{ background: "var(--paper)", border: "3px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)", padding: "28px 30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  flex: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid var(--ink)",
                  boxShadow: "4px 4px 0 var(--red)",
                  background: user.image ? `center/cover no-repeat url(${user.image})` : "var(--ink)",
                  color: "var(--paper)",
                  fontFamily: anton,
                  fontSize: 34,
                  letterSpacing: 1,
                }}
              >
                {user.image ? "" : initialsOf(label)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-permanent-marker), cursive",
                    fontSize: 15,
                    background: "var(--yellow)",
                    color: "var(--ink)",
                    padding: "3px 12px",
                    transform: "rotate(-2deg)",
                    border: "2px solid var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  {role}
                </div>
                <h1 style={{ margin: 0, fontFamily: anton, fontSize: "clamp(30px,5vw,48px)", lineHeight: 0.95, letterSpacing: 1, textTransform: "uppercase" }}>
                  {label}
                </h1>
                <div style={{ fontFamily: elite, fontSize: 14, marginTop: 6, opacity: 0.8 }}>{user.email}</div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div style={{ marginTop: 22, display: "flex", gap: 14, flexWrap: "wrap" }}>
            {user.role === "PROVIDER" && (
              <ActionLink href="/dashboard" label={t("profile.manage_rooms")} />
            )}
            <ActionLink href="/saved" label={t("profile.saved_rooms")} />
            <button
              onClick={handleSignOut}
              style={{
                cursor: "pointer",
                fontFamily: anton,
                letterSpacing: 1,
                fontSize: 15,
                padding: "12px 18px",
                background: "var(--ink)",
                color: "var(--paper)",
                border: 0,
                boxShadow: "4px 4px 0 var(--red)",
              }}
            >
              {t("nav.signout")}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        fontFamily: anton,
        letterSpacing: 1,
        fontSize: 15,
        padding: "12px 18px",
        background: "var(--red)",
        color: "var(--paper)",
        boxShadow: "4px 4px 0 var(--ink)",
      }}
    >
      {label}
    </Link>
  );
}
