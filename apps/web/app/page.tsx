import type { RoomCard } from "@jamroom/shared";
import { api } from "@/lib/api";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Finder } from "@/components/Finder";
import { ApiOffline } from "@/components/ApiOffline";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let rooms: RoomCard[] = [];
  let failed = false;
  let detail = "";
  try {
    rooms = await api.listRooms();
  } catch (e) {
    failed = true;
    detail = e instanceof Error ? e.message : "";
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Masthead />
      {failed ? <ApiOffline detail={detail} /> : <Finder initialRooms={rooms} />}
      <Footer />
    </div>
  );
}
