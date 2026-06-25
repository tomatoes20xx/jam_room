// Lazily loads the Google Maps JS API (with the Places library) exactly once
// and resolves to the `google.maps` namespace. Callers use
// `maps.importLibrary("places")` to get the new Places classes.
let promise: Promise<any> | null = null;

export function loadMaps(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("Maps can only load in the browser"));
  if (promise) return promise;

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (!key) return Promise.reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_KEY"));

  promise = new Promise((resolve, reject) => {
    const w = window as any;
    if (w.google?.maps) return resolve(w.google.maps);

    w.__jamRoomInitMaps = () => resolve(w.google.maps);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly&libraries=places&loading=async&callback=__jamRoomInitMaps`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return promise;
}
