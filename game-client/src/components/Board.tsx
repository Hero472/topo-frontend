// ── Board.tsx ──
import type { FullState, DeckColor } from "../types/types";
import PlayerArea from "./PlayerArea";
import CardView from "./CardView";

interface Props {
  board: FullState;
}

export default function Board({ board }: Readonly<Props>) {
  const { your_board, opponent, scales, dealer_top, dealer_count, your_turn } = board;

  return (
    <div style={{ flex: 2 }}>
      {/* ── Game info bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Game Board</h2>

        {/* Dealer info */}
        <div
          style={{
            padding: "4px 12px",
            background: "#eee",
            borderRadius: 8,
            fontSize: "0.9em",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🃏 Dealer: {dealer_count} cards
          {dealer_top && (
            <span
              style={{
                color: dealerTopColor(dealer_top),
                marginLeft: 4,
                fontWeight: 600,
              }}
            >
              (top: {dealer_top})
            </span>
          )}
        </div>
      </div>

      {/* ── Shared scales ── */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 8px" }}>Scales</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {scales.map((scale, idx) => {
            if (scale === null) {
              // Empty slot – show a dimmed placeholder
              return (
                <div
                  key={idx}
                  style={{
                    border: "1px dashed #ccc",
                    borderRadius: 8,
                    padding: 8,
                    minWidth: 120,
                    background: "#f9f9f9",
                    opacity: 0.5,
                  }}
                >
                  <div style={{ fontSize: "0.8em", fontWeight: "bold" }}>
                    Scale {idx}
                  </div>
                  <div style={{ fontSize: "0.85em", color: "#888" }}>
                    Empty
                  </div>
                </div>
              );
            }
            // Active scale
            return (
              <div
                key={scale.scale_idx}
                style={{
                  border: "1px solid #999",
                  borderRadius: 8,
                  padding: 8,
                  minWidth: 120,
                  background: "#fff",
                }}
              >
                <div style={{ fontSize: "0.8em", fontWeight: "bold" }}>
                  Scale {scale.scale_idx}
                </div>
                <div style={{ fontSize: "0.85em" }}>
                  {scale.cards.length === 0 ? (
                    "Empty"
                  ) : (
                    scale.cards.map((c, i) => (
                      <CardView key={i} card={c} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Player areas ── */}
      <div style={{ display: "flex", gap: 30 }}>
        <PlayerArea
          label="You"
          board={your_board}
          isTurn={your_turn}
        />
        <PlayerArea
          label="Opponent"
          board={opponent}
          isTurn={!your_turn}
        />
      </div>
    </div>
  );
}

/** Map DeckColor to a CSS color for display */
function dealerTopColor(color: DeckColor): string {
  switch (color) {
    case "red":
      return "#c33";
    case "blue":
      return "#36c";
    case "black":
      return "#111";
    case "white":
      return "#666";   // dark enough on light background
    default:
      return "#333";
  }
}