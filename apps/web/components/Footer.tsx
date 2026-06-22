export function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 2,
        background: "var(--dark)",
        color: "#b8b09a",
        padding: "30px 28px",
        borderTop: "4px solid var(--red)",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontFamily: "var(--font-anton), sans-serif", color: "var(--paper)", fontSize: 22, letterSpacing: 1 }}>
          JAMROOM FINDER<span style={{ color: "var(--red)" }}>.</span>
        </div>
        <div style={{ fontFamily: "var(--font-special-elite), monospace", fontSize: 12 }}>
          made loud in tbilisi · plug in &amp; get loud · BYO earplugs
        </div>
      </div>
    </footer>
  );
}
