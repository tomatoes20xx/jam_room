"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

type SavedContextValue = {
  saved: string[];
  toggle: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const SavedContext = createContext<SavedContextValue | null>(null);

/**
 * Single source of truth for saved rooms, mounted once at the app root.
 * Saved rooms live ONLY on the server (the SavedRoom table) — nothing is kept
 * in localStorage. State is loaded for the signed-in user and cleared on
 * sign-out so one user's saves never linger for the next.
 */
export function SavedProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  // Depend on the stable user-id string, not the session object (its identity
  // changes every render, which would re-run the effect endlessly).
  const userId = session?.user?.id ?? null;
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    if (isPending) return;
    // Signed out → no saved rooms. This is also what clears the previous
    // user's saves the moment they log out.
    if (!userId) {
      setSaved([]);
      return;
    }
    let cancelled = false;
    api
      .listSaved()
      .then((rooms) => {
        if (!cancelled) setSaved(rooms.map((r) => r.id));
      })
      .catch(() => {
        if (!cancelled) setSaved([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, userId]);

  const toggle = useCallback(
    (id: string) => {
      // Saving is account-only now — send anonymous users to sign in.
      if (!userId) {
        router.push("/login");
        return;
      }
      const has = saved.includes(id);
      setSaved(has ? saved.filter((x) => x !== id) : [...saved, id]); // optimistic
      (has ? api.unsave(id) : api.save(id)).catch(() => {
        // Roll back if the write fails — the server is the source of truth.
        setSaved((cur) => (has ? [...cur, id] : cur.filter((x) => x !== id)));
      });
    },
    [saved, userId, router],
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
