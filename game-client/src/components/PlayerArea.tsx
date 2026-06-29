import type { PlayerBoard, OpponentBoard } from "../types/types";
import CardView from "./CardView";

interface Props {
  label: string;       // "You" or "Opponent"
  board: PlayerBoard | OpponentBoard;
  isTurn: boolean;
}

// Type guard to tell if the board belongs to the local player
function isPlayerBoard(
  board: PlayerBoard | OpponentBoard,
): board is PlayerBoard {
  return "hand" in board;
}

export default function PlayerArea({ label, board, isTurn }: Readonly<Props>) {
  const self = isPlayerBoard(board);

  const containerStyle = {
    ...styles.card,
    borderColor: isTurn ? "#ffd700" : "rgba(255,255,255,0.1)",
    boxShadow: isTurn
      ? "0 0 12px rgba(255,215,0,0.4)"
      : "0 4px 12px rgba(0,0,0,0.3)",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={styles.header}>
        <span style={{ fontWeight: 700, fontSize: "1rem" }}>
          {label}
          {self ? "" : `: ${board.username}`}
        </span>
        <span style={{ opacity: 0.7 }}>
          {isTurn ? "⚡ Your turn" : "🕒 Waiting"}
        </span>
      </div>

      {/* Hand (visible only for self) */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Hand</div>
        {self ? (
          <div style={styles.handRow}>
            {board.hand.length === 0 ? (
              <span style={{ opacity: 0.5 }}>No cards</span>
            ) : (
              board.hand.map((c, i) => (
                <div key={i} style={styles.cardWrap}>
                  <CardView card={c} />
                </div>
              ))
            )}
          </div>
        ) : (
          <span style={{ opacity: 0.5 }}>??? (hidden)</span>
        )}
      </div>

      {/* Personal pile */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Personal</div>
        {self ? (
          <div style={styles.personalDisplay}>
            <span style={{ fontWeight: 600 }}>
              {board.personal.count} card{board.personal.count !== 1 ? "s" : ""}
            </span>
            {board.personal.top && (
              <span style={{ marginLeft: 8 }}>
                (top: <CardView card={board.personal.top} small />)
              </span>
            )}
          </div>
        ) : (
          <div style={styles.personalDisplay}>
            <span style={{ fontWeight: 600 }}>
              {board.personal_count} card
              {board.personal_count !== 1 ? "s" : ""}
            </span>
            {board.personal_top && (
              <span style={{ marginLeft: 8 }}>
                (top: <CardView card={board.personal_top} small />)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Side stacks */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Side</div>
        <div style={styles.sideGrid}>
          {board.side.map((stack, idx) => (
            <div key={idx} style={styles.sideStack}>
              <div style={styles.stackLabel}>Stack {idx}</div>
              <div style={styles.stackCards}>
                {stack.length === 0 ? (
                  <span style={{ opacity: 0.5, fontSize: "0.7rem" }}>empty</span>
                ) : (
                  stack.map((c, j) => (
                    <CardView key={j} card={c} small />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Dark theme styles ──
const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(8px)",
    borderRadius: 12,
    border: "2px solid transparent",
    padding: 16,
    color: "#fff",
    minWidth: 260,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: 8,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
    marginBottom: 4,
  },
  handRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  cardWrap: {
    display: "inline-block",
  },
  personalDisplay: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  sideGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
  },
  sideStack: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: 6,
    minHeight: 40,
  },
  stackLabel: {
    fontSize: "0.7rem",
    fontWeight: 600,
    marginBottom: 2,
    opacity: 0.8,
  },
  stackCards: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
  },
};