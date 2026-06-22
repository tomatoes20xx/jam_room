"use client";

// Saved-rooms state now lives in a single app-root provider so all consumers
// share one fetch. Re-exported here to keep existing import paths working.
export { useSaved } from "@/components/SavedProvider";
