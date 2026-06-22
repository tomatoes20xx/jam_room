"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { useSession } from "./auth-client";

const KEY = "jamroom_saved";

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/**
 * Saved-rooms state. Uses localStorage so guests get the prototype behaviour,
 * and mirrors writes to the API when the user is signed in.
 */
export function useSaved() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(readLocal());
  }, []);

  useEffect(() => {
    if (!session) return;
    api
      .listSaved()
      .then((rooms) => {
        const ids = rooms.map((r) => r.id);
        setSaved(ids);
        localStorage.setItem(KEY, JSON.stringify(ids));
      })
      .catch(() => {
        /* stay with local */
      });
  }, [session]);

  const toggle = useCallback(
    (id: string) => {
      setSaved((prev) => {
        const has = prev.includes(id);
        const next = has ? prev.filter((x) => x !== id) : [...prev, id];
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        if (session) {
          (has ? api.unsave(id) : api.save(id)).catch(() => {
            /* best effort */
          });
        }
        return next;
      });
    },
    [session],
  );

  return { saved, toggle, isSaved: (id: string) => saved.includes(id) };
}
