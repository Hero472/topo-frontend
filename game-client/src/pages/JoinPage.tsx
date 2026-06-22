// ── JoinPage.tsx ──
export function JoinPage() {
  // You can make the room dynamic later; for now it’s hardcoded
  const room = "myroom";

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Join Game</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        <a href={`?room=${room}&username=Alice`} style={{ fontSize: "1.2em" }}>
          Join as Alice
        </a>
        <a href={`?room=${room}&username=Bob`} style={{ fontSize: "1.2em" }}>
          Join as Bob
        </a>
        {/* Add more links or an input form as needed */}
      </div>
    </div>
  );
}