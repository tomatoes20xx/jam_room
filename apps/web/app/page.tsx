import type { RoomCard } from "@jamroom/shared";
import { api } from "@/lib/api";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Finder } from "@/components/Finder";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let rooms: RoomCard[] = [];
  let error: string | null = null;
  try {
    rooms = await api.listRooms();
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not reach the API";
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      {error ? (
        <main style={{ maxWidth: 760, margin: "0 auto", padding: "60px 28px" }}>
          <div style={{ border: "3px dashed var(--ink)", background: "var(--paper)", padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 34 }}>API OFFLINE</div>
            <p style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 14 }}>
              Could not load rooms ({error}). Start the API with <code>pnpm dev</code> and make sure the database is seeded.
            </p>
          </div>
        </main>
      ) : (
        <Finder initialRooms={rooms} />
      )}
      <Footer />
    </div>
  );
}
