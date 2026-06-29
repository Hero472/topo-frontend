import { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import type { Action, Card, PersonalPile, Scale } from "../types/types";
import CardView from "./CardView";

interface Props {
  sendAction: (action: Action) => void;
  isMyTurn: boolean;
  hand: Card[];
  scales: Scale[];
  side: Card[][];
  personal: PersonalPile;
}

export default function ActionPanel({
  sendAction,
  isMyTurn,
  hand,
  scales,
  side,
  personal,
}: Readonly<Props>) {
  const canDraw = useGameStore((s) => s.canDraw);

  // Core selection state
  const [selectedHandIdx, setSelectedHandIdx] = useState<number | null>(null);
  const [targetScaleIdx, setTargetScaleIdx] = useState<number | null>(null);
  const [targetSideIdx, setTargetSideIdx] = useState<number | null>(null);

  // Helper to reset selections after sending an action
  const resetSelections = () => {
    setSelectedHandIdx(null);
    setTargetScaleIdx(null);
    setTargetSideIdx(null);
  };

  // Action dispatchers that reset afterwards
  const act = (action: Action) => {
    sendAction(action);
    resetSelections();
  };

  if (!isMyTurn) {
    return (
      <div style={styles.waitingPanel}>
        <div style={{ fontSize: "2rem", opacity: 0.6 }}>🕒</div>
        <p style={{ marginTop: 8, opacity: 0.7 }}>Opponent's turn</p>
      </div>
    );
  }

  const personalTopIsAce = personal.top?.value === 1;

  const canOpenScale = selectedHandIdx !== null;
  const canPlayHand = selectedHandIdx !== null && targetScaleIdx !== null;
  const canPlayPersonal = personal.count > 0 && targetScaleIdx !== null && !personalTopIsAce;
  const canPlayPersonalAce = personal.count > 0 && personalTopIsAce;
  const canPlaySide = targetSideIdx !== null && targetScaleIdx !== null && side[targetSideIdx].length > 0;
  const canMoveHandToSide = selectedHandIdx !== null && targetSideIdx !== null;
  const canMovePersonalToSide = personal.count > 0 && targetSideIdx !== null && personal.top?.value === 13; // only King

  return (
    <div style={styles.panel}>
      {/* ── Draw section ── */}
      <div style={styles.section}>
        <button
          onClick={() => act({ type: "draw" })}
          disabled={!canDraw}
          style={canDraw ? styles.drawButton : { ...styles.drawButton, opacity: 0.5, cursor: "not-allowed" }}
        >
          🃏 Draw a card
        </button>
      </div>

      {/* ── Your hand ── */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Your hand</div>
        <div style={styles.handRow}>
          {hand.length === 0 && <span style={{ opacity: 0.5 }}>No cards</span>}
          {hand.map((card, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (selectedHandIdx === idx) {
                  setSelectedHandIdx(null);
                } else {
                  setSelectedHandIdx(idx);
                  // Hand card selection resets other targets to avoid mixed intents
                  setTargetScaleIdx(null);
                  setTargetSideIdx(null);
                }
              }}
              style={{
                ...styles.cardWrapper,
                borderColor: selectedHandIdx === idx ? "#ffd700" : "transparent",
                transform: selectedHandIdx === idx ? "translateY(-4px)" : "none",
              }}
            >
              <CardView card={card} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div style={styles.actionBar}>
        {canOpenScale && (
          <button
            onClick={() => act({ type: "open_scale", hand_idx: selectedHandIdx! })}
            style={styles.actionButton}
          >
            📂 Open Scale
          </button>
        )}
        {canPlayHand && (
          <button
            onClick={() => act({ type: "play_hand", hand_idx: selectedHandIdx!, scale_idx: targetScaleIdx! })}
            style={styles.actionButton}
          >
            ▶️ Play on Scale {targetScaleIdx}
          </button>
        )}
        {canMoveHandToSide && (
          <button
            onClick={() => act({ type: "move_to_side", hand_idx: selectedHandIdx!, stack_idx: targetSideIdx! })}
            style={styles.actionButton}
          >
            ➡️ Move to Side {targetSideIdx}
          </button>
        )}
        {canPlayPersonalAce && (
          <button
            onClick={() => act({ type: "play_personal", scale_idx: 0 })} // server ignores scale_idx for Ace
            style={styles.actionButton}
          >
            📂 Open Scale from Personal
          </button>
        )}
        {canPlayPersonal && (
          <button
            onClick={() => act({ type: "play_personal", scale_idx: targetScaleIdx! })}
            style={styles.actionButton}
          >
            📦 Play Personal on Scale {targetScaleIdx}
          </button>
        )}
        {canMovePersonalToSide && (
          <button
            onClick={() => act({ type: "move_personal_to_side", stack_idx: targetSideIdx! })}
            style={styles.actionButton}
          >
            📦 Move Personal to Side
          </button>
        )}
        {canPlaySide && (
          <button
            onClick={() => act({ type: "play_side", stack_idx: targetSideIdx!, scale_idx: targetScaleIdx! })}
            style={styles.actionButton}
          >
            🃟 Play Side Card on Scale {targetScaleIdx}
          </button>
        )}
      </div>

      {/* ── Targets: Scales & Side Stacks ── */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Select a target</div>
        <div style={styles.targetRow}>
          {/* Scales – only show active (non‑null) scales */}
          {scales.filter((s): s is Scale => s !== null)
            .map((scale) => (
              <div
                key={scale.scale_idx}
                onClick={() =>
                  setTargetScaleIdx((prev) =>
                    prev === scale.scale_idx ? null : scale.scale_idx
                  )
                }
                style={{
                  ...styles.targetCard,
                  borderColor:
                    targetScaleIdx === scale.scale_idx ? "#ffd700" : "#444",
                  background: "#1e1e2f",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.8rem", marginBottom: 4 }}>
                  Scale {scale.scale_idx}
                </div>
                <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {scale.cards.length === 0 && (
                    <span style={{ opacity: 0.5, fontSize: "0.7rem" }}>empty</span>
                  )}
                  {scale.cards.map((c, i) => (
                    <CardView key={i} card={c} small />
                  ))}
                </div>
              </div>
            ))}
          {scales.every((s) => s === null) && (
            <div style={{ color: "#666", fontSize: "0.8rem" }}>No active scales</div>
          )}
        </div>
        <div style={{ ...styles.targetRow, marginTop: 12 }}>
          {/* Side stacks – no longer clears scale selection */}
          {side.map((stack, idx) => (
            <div
              key={idx}
              onClick={() =>
                setTargetSideIdx((prev) => (prev === idx ? null : idx))
              }
              style={{
                ...styles.targetCard,
                borderColor: targetSideIdx === idx ? "#ffd700" : "#444",
                background: "#1e1e2f",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.8rem", marginBottom: 4 }}>
                Side {idx}
              </div>
              <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {stack.length === 0 && <span style={{ opacity: 0.5, fontSize: "0.7rem" }}>empty</span>}
                {stack.map((c, j) => (
                  <CardView key={j} card={c} small />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Personal pile info ── */}
      <div style={styles.personalInfo}>
        <strong>Personal pile:</strong> {personal.count} cards
        {personal.top && (
          <>
            {" "}
            (top: <CardView card={personal.top} small />)
          </>
        )}
        <span style={{ marginLeft: 12, fontSize: "0.8rem", opacity: 0.7 }}>
          {personal.top?.value === 13
            ? "King can be moved to side"
            : personal.top?.value === 1
            ? "Ace opens a new scale"
            : ""}
        </span>
      </div>
    </div>
  );
}

// ── Styles (unchanged) ──
const styles: Record<string, React.CSSProperties> = {
  panel: {
    flex: 1,
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(8px)",
    borderRadius: 12,
    padding: 20,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    overflowY: "auto",
  },
  waitingPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    opacity: 0.8,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    marginBottom: 8,
    color: "#ccc",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  handRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  cardWrapper: {
    display: "inline-block",
    borderRadius: 6,
    border: "2px solid transparent",
    transition: "all 0.15s",
    cursor: "pointer",
    background: "rgba(255,255,255,0.05)",
  },
  actionBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: "4px 0",
  },
  actionButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#e63946",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  drawButton: {
    padding: "10px 24px",
    borderRadius: 8,
    border: "none",
    background: "#e63946",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
  },
  targetRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  targetCard: {
    padding: 10,
    borderRadius: 8,
    border: "2px solid #444",
    cursor: "pointer",
    minWidth: 80,
    transition: "all 0.15s",
    background: "#1e1e2f",
  },
  personalInfo: {
    fontSize: "0.85rem",
    padding: "8px 0",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    marginTop: 8,
  },
};