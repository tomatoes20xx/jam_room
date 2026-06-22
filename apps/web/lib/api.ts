import type {
  RoomCard,
  RoomDetail,
  RoomInput,
  RoomListQuery,
  RoomListResponse,
  Review,
  ReviewInput,
} from "@jamroom/shared";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  // Only declare a JSON content-type when we actually send a body — Fastify
  // rejects an empty body when content-type is application/json.
  const headers: Record<string, string> = { ...(init?.headers as Record<string, string>) };
  if (init?.body != null) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function toQueryString(query: Partial<RoomListQuery>): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.genre) params.set("genre", query.genre);
  if (query.priceTier) params.set("priceTier", query.priceTier);
  if (query.openNow) params.set("openNow", "true");
  if (query.sort) params.set("sort", query.sort);
  if (query.limit != null) params.set("limit", String(query.limit));
  if (query.offset != null) params.set("offset", String(query.offset));
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const api = {
  listRooms: (query: Partial<RoomListQuery> = {}) =>
    req<RoomListResponse>(`/rooms${toQueryString(query)}`),
  getRoom: (id: string) => req<{ room: RoomDetail }>(`/rooms/${id}`).then((r) => r.room),
  myRooms: () => req<{ rooms: RoomCard[] }>(`/my/rooms`).then((r) => r.rooms),
  createRoom: (input: RoomInput) =>
    req<{ room: RoomDetail }>(`/rooms`, { method: "POST", body: JSON.stringify(input) }).then((r) => r.room),
  updateRoom: (id: string, input: Partial<RoomInput>) =>
    req<{ room: RoomDetail }>(`/rooms/${id}`, { method: "PATCH", body: JSON.stringify(input) }).then(
      (r) => r.room,
    ),
  deleteRoom: (id: string) => req<void>(`/rooms/${id}`, { method: "DELETE" }),
  addReview: (roomId: string, input: ReviewInput) =>
    req<{ review: Review }>(`/rooms/${roomId}/reviews`, {
      method: "POST",
      body: JSON.stringify(input),
    }).then((r) => r.review),
  listSaved: () => req<{ rooms: RoomCard[] }>(`/saved`).then((r) => r.rooms),
  save: (roomId: string) => req<{ ok: true }>(`/saved/${roomId}`, { method: "POST" }),
  unsave: (roomId: string) => req<void>(`/saved/${roomId}`, { method: "DELETE" }),
};
