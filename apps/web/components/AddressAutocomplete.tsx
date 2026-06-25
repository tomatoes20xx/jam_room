"use client";

import { useEffect, useRef, useState } from "react";
import { loadMaps } from "@/lib/maps";

const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

// Tbilisi center — biases suggestions toward the city.
const TBILISI = { lat: 41.7151, lng: 44.8271 };

export type PlacePick = {
  address: string;
  lat: number;
  lng: number;
  neighborhood: string;
};

type Suggestion = { id: string; text: string; prediction: any };

export function AddressAutocomplete({
  label,
  value,
  onChange,
  onSelect,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (pick: PlacePick) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const placesRef = useRef<any>(null);
  const tokenRef = useRef<any>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load the Places library once on mount.
  useEffect(() => {
    let cancelled = false;
    loadMaps()
      .then((maps) => maps.importLibrary("places"))
      .then((places: any) => {
        if (!cancelled) placesRef.current = places;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the dropdown when clicking elsewhere.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const fetchSuggestions = (input: string) => {
    const places = placesRef.current;
    if (!places || !input.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (!tokenRef.current) tokenRef.current = new places.AutocompleteSessionToken();
    places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      sessionToken: tokenRef.current,
      includedRegionCodes: ["ge"],
      locationBias: { center: TBILISI, radius: 20000 },
    })
      .then(({ suggestions: raw }: any) => {
        const list: Suggestion[] = (raw ?? [])
          .filter((s: any) => s.placePrediction)
          .map((s: any) => ({
            id: s.placePrediction.placeId,
            text: s.placePrediction.text?.text ?? "",
            prediction: s.placePrediction,
          }));
        setSuggestions(list);
        setOpen(list.length > 0);
        setActive(-1);
      })
      .catch(() => setSuggestions([]));
  };

  const handleChange = (v: string) => {
    onChange(v);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetchSuggestions(v), 220);
  };

  const choose = async (s: Suggestion) => {
    setOpen(false);
    setSuggestions([]);
    try {
      const place = s.prediction.toPlace();
      await place.fetchFields({ fields: ["formattedAddress", "location", "addressComponents"] });
      const comps: any[] = place.addressComponents ?? [];
      const findType = (t: string) => comps.find((c) => c.types?.includes(t))?.longText;
      const hood = findType("neighborhood") ?? findType("sublocality") ?? findType("sublocality_level_1") ?? "";
      const address = place.formattedAddress ?? s.text;
      onChange(address);
      onSelect({
        address,
        lat: place.location?.lat() ?? TBILISI.lat,
        lng: place.location?.lng() ?? TBILISI.lng,
        neighborhood: hood,
      });
    } catch {
      onChange(s.text);
    } finally {
      tokenRef.current = null; // end the billed autocomplete session
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <label style={{ fontFamily: anton, letterSpacing: 1, fontSize: 13, marginBottom: 7, display: "block" }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        style={{
          width: "100%",
          border: "3px solid var(--ink)",
          background: "var(--paper)",
          fontFamily: elite,
          fontSize: 15,
          padding: "12px 14px",
          color: "var(--ink)",
          outline: "none",
        }}
      />
      {open && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 20,
            top: "100%",
            left: 0,
            right: 0,
            margin: "4px 0 0",
            padding: 0,
            listStyle: "none",
            background: "var(--paper)",
            border: "3px solid var(--ink)",
            boxShadow: "5px 5px 0 var(--ink)",
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              onMouseEnter={() => setActive(i)}
              style={{
                padding: "10px 13px",
                fontFamily: elite,
                fontSize: 13.5,
                lineHeight: 1.35,
                cursor: "pointer",
                borderBottom: i < suggestions.length - 1 ? "1px dashed rgba(0,0,0,.25)" : "none",
                background: i === active ? "var(--yellow)" : "transparent",
              }}
            >
              {s.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
