import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { RoomDetailView } from "@/components/RoomDetailView";

export const dynamic = "force-dynamic";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const room = await api.getRoom(id);
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Masthead />
        <RoomDetailView room={room} />
        <Footer />
      </div>
    );
  } catch {
    notFound();
  }
}
