const anton = "var(--font-anton), sans-serif";
const elite = "var(--font-special-elite), monospace";

export function AuthField({
  label,
  hint,
  ...input
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label style={{ fontFamily: anton, letterSpacing: 1, fontSize: 13, marginBottom: 7, display: "block" }}>
        {label}
        {hint && <span style={{ fontFamily: elite, fontSize: 11, opacity: 0.6, letterSpacing: 0 }}> — {hint}</span>}
      </label>
      <input
        {...input}
        style={{
          width: "100%",
          border: "3px solid var(--ink)",
          background: "var(--paper)",
          fontFamily: elite,
          fontSize: 15,
          padding: "12px 14px",
          color: "var(--ink)",
          outline: "none",
          transition: "box-shadow .08s",
        }}
      />
    </div>
  );
}
