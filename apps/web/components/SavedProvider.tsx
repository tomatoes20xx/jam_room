"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

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

type SavedContextValue = {
  saved: string[];
  toggle: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const SavedContext = createContext<SavedContextValue | null>(null);

/**
 * Single source of truth for saved rooms, mounted once at the app root.
 * Without this, every component calling useSaved() ran its own effect and its
 * own /saved fetch (and Strict Mode doubled each), causing redundant calls.
 */
export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  // Depend on the stable user-id string, not the session object (its identity
  // changes every render, which would re-run the effect endlessly).
  const userId = session?.user?.id ?? null;
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(readLocal());
  }, []);

  useEffect(() => {
    if (!userId) return;
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
  }, [userId]);

  const toggle = useCallback(
    (id: string) => {
      // Decide and fire the side effect ONCE, outside the state updater.
      const has = saved.includes(id);
      const next = has ? saved.filter((x) => x !== id) : [...saved, id];
      setSaved(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      if (userId) {
        (has ? api.unsave(id) : api.save(id)).catch(() => {
          /* best effort */
        });
      }
    },
    [saved, userId],
  );

  const value = useMemo<SavedContextValue>(
    () => ({ saved, toggle, isSaved: (id: string) => saved.includes(id) }),
    [saved, toggle],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within <SavedProvider>");
  return ctx;
}
