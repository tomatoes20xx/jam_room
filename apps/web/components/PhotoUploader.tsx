"use client";

import { useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

export type UploadedPhoto = { url: string; key: string };

const anton = "var(--font-anton), sans-serif";
const elite = "var(--font-special-elite), monospace";

export function PhotoUploader({ photos, onChange }: { photos: UploadedPhoto[]; onChange: (p: UploadedPhoto[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { startUpload, isUploading } = useUploadThing("roomImage", {
    onClientUploadComplete: (res) => {
      const uploaded = (res ?? []).map((f) => {
        const file = f as { ufsUrl?: string; url: string; key: string };
        return { url: file.ufsUrl ?? file.url, key: file.key };
      });
      onChange([...photos, ...uploaded]);
    },
    onUploadError: (e) => setError(e.message || "Upload failed. Is UPLOADTHING_TOKEN set on the API?"),
  });

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    void startUpload(Array.from(files));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
        {photos.map((p) => (
          <div
            key={p.key}
            style={{ position: "relative", aspectRatio: "4/3", border: "3px solid var(--ink)", background: `center/cover no-repeat url(${p.url})`, boxShadow: "4px 4px 0 var(--ink)" }}
          >
            <button
              type="button"
              onClick={() => onChange(photos.filter((x) => x.key !== p.key))}
              style={{ position: "absolute", top: 6, right: 6, width: 28, height: 28, border: "2px solid var(--ink)", background: "var(--paper)", color: "var(--ink)", fontFamily: anton, fontSize: 16, cursor: "pointer", lineHeight: 1 }}
              aria-label="Remove photo"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          style={{
            cursor: "pointer",
            aspectRatio: "4/3",
            border: "3px dashed var(--ink)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--paper)",
            color: "var(--ink)",
            backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,.07) 0 2px, transparent 2px 12px)",
          }}
        >
          <div style={{ fontFamily: anton, fontSize: 30, lineHeight: 1 }}>{isUploading ? "…" : "+"}</div>
          <div style={{ fontFamily: elite, fontSize: 11, letterSpacing: 1, marginTop: 8, textAlign: "center" }}>
            {isUploading ? "UPLOADING" : "DROP PHOTO"}
          </div>
        </button>
      </div>
      {error && <div style={{ marginTop: 10, color: "var(--red)", fontFamily: elite, fontSize: 13 }}>{error}</div>}
    </div>
  );
}
