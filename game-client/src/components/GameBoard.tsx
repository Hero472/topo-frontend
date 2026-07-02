import PlayerBoard from "./PlayerBoard";
import CenterArea from "./CenterArea";

export default function GameBoard() {

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "1fr auto 1fr",
        height: "100vh",
        padding: "14px",
        gap: "14px",
        boxSizing: "border-box",
        background:
          "radial-gradient(ellipse at center, #1b4d1b 0%, #0a2e0a 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Opponent */}
      <div
        style={{
          overflow: "auto",
          padding: "8px 10px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "10px",
          backdropFilter: "blur(6px)",
          minHeight: 0,
        }}
      >
        <PlayerBoard playerId="opponent" rotated />
      </div>

      {/* Center */}
      <div
        style={{
          background: "rgba(0,0,0,0.25)",
          borderRadius: "14px",
          padding: "12px",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(4px)",
        }}
      >
        <CenterArea />
      </div>

      {/* Current player */}
      <div
        style={{
          overflow: "auto",
          padding: "8px 10px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "10px",
          backdropFilter: "blur(6px)",
          minHeight: 0,
        }}
      >
        <PlayerBoard playerId="current" />
      </div>
    </div>
  );
}