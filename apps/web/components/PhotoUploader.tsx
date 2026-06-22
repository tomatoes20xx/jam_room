"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n";

/** A photo the user has picked but not yet uploaded — held locally until the room is created. */
export type PendingPhoto = { file: File; previewUrl: string };

const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

export function PhotoUploader({
  photos,
  onChange,
  disabled,
}: {
  photos: PendingPhoto[];
  onChange: (p: PendingPhoto[]) => void;
  disabled?: boolean;
}) {
  const { t } = useT();
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const added = Array.from(files).map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    onChange([...photos, ...added]);
  };

  const remove = (photo: PendingPhoto) => {
    URL.revokeObjectURL(photo.previewUrl);
    onChange(photos.filter((x) => x !== photo));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
        {photos.map((p) => (
          <div
            key={p.previewUrl}
            style={{ position: "relative", aspectRatio: "4/3", border: "3px solid var(--ink)", background: `center/cover no-repeat url(${p.previewUrl})`, boxShadow: "4px 4px 0 var(--ink)" }}
          >
            <button
              type="button"
              onClick={() => remove(p)}
              style={{ position: "absolute", top: 6, right: 6, width: 28, height: 28, border: "2px solid var(--ink)", background: "var(--paper)", color: "var(--ink)", fontFamily: anton, fontSize: 16, cursor: "pointer", lineHeight: 1 }}
              aria-label={t("photo.remove")}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          style={{
            cursor: disabled ? "default" : "pointer",
            aspectRatio: "4/3",
            border: "3px dashed var(--ink)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--paper)",
            color: "var(--ink)",
            backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,.07) 0 2px, transparent 2px 12px)",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <div style={{ fontFamily: anton, fontSize: 30, lineHeight: 1 }}>+</div>
          <div style={{ fontFamily: elite, fontSize: 11, letterSpacing: 1, marginTop: 8, textAlign: "center" }}>
            {t("photo.drop")}
          </div>
        </button>
      </div>
    </div>
  );
}
