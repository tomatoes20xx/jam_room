const anton = "var(--font-anton), var(--font-anton-ge), sans-serif";
const elite = "var(--font-special-elite), monospace";

/** Strip everything but digits and cap to a Georgian subscriber number (9 digits). */
export function phoneDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 9);
}

/** 9 digits → "123 12 32 52" (groups of 3/2/2/2). */
export function formatGeorgian(digits: string): string {
  const d = phoneDigits(digits);
  return [d.slice(0, 3), d.slice(3, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
}

/** Full stored/displayed value, e.g. "+995 123 12 32 52". */
export function toFullPhone(digits: string): string {
  return `+995 ${formatGeorgian(digits)}`.trim();
}

export function PhoneField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (digits: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label style={{ fontFamily: anton, letterSpacing: 1, fontSize: 13, marginBottom: 7, display: "block" }}>
        {label}
      </label>
      <div style={{ display: "flex", border: "3px solid var(--ink)", background: "var(--paper)" }}>
        <span
          style={{
            fontFamily: elite,
            fontSize: 15,
            padding: "12px 12px",
            background: "var(--ink)",
            color: "var(--paper)",
            display: "flex",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          +995
        </span>
        <input
          type="tel"
          inputMode="numeric"
          required={required}
          value={formatGeorgian(value)}
          onChange={(e) => onChange(phoneDigits(e.target.value))}
          placeholder="000 00 00 00"
          style={{
            flex: 1,
            border: 0,
            background: "transparent",
            fontFamily: elite,
            fontSize: 15,
            padding: "12px 14px",
            color: "var(--ink)",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}
