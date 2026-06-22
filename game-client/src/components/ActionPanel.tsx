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

  // ── selection state ──
  const [selHandIdx, setSelHandIdx] = useState<number | null>(null);
  const [selScaleIdx, setSelScaleIdx] = useState<number | null>(null);
  const [selStackIdx, setSelStackIdx] = useState<number | null>(null);

  // clear selections when turn or state changes (optional, but tidy)
  // we can keep them between actions; the user might want to reuse
  // however, we'll just let them click again

  if (!isMyTurn) {
    return (
      <div style={{ padding: 20, textAlign: "center", fontSize: "1.2em" }}>
        🕒 Waiting for opponent…
      </div>
    );
  }

  // const hasHand = hand.length > 0;
  // const hasScales = scales.length > 0;
  const hasPersonal = personal.count > 0;

  // ── shared style helpers ──
  const sectionStyle: React.CSSProperties = {
    marginBottom: 16,
    padding: 12,
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    background: "#fafafa",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #ccc",
    background: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginRight: 6,
  };

  const disabledBtn = { ...buttonStyle, opacity: 0.5, cursor: "not-allowed" };

  // ── selection cards ──
  const handCards = hand.map((card, idx) => (
    <span
      key={idx}
      onClick={() => setSelHandIdx(idx)}
      style={{
        display: "inline-block",
        margin: 4,
        padding: 2,
        border: selHandIdx === idx ? "2px solid #1976d2" : "2px solid transparent",
        borderRadius: 6,
        cursor: "pointer",
        background: selHandIdx === idx ? "#e3f2fd" : undefined,
      }}
    >
      <CardView card={card} />
    </span>
  ));

  const scaleTargets = scales.map((scale, idx) => (
    <span
      key={idx}
      onClick={() => setSelScaleIdx(idx)}
      style={{
        display: "inline-block",
        margin: 4,
        padding: 6,
        border: selScaleIdx === idx ? "2px solid #1976d2" : "2px solid #ccc",
        borderRadius: 6,
        background: selScaleIdx === idx ? "#e3f2fd" : scale.completed ? "#d4edda" : "#fff",
        cursor: "pointer",
        fontSize: "0.9em",
      }}
    >
      Scale {scale.scale_idx}
      {scale.completed && " ✅"}
      <br />
      {scale.cards.length > 0 ? (
        scale.cards.map((c, i) => <CardView key={i} card={c} />)
      ) : (
        <span style={{ color: "#999" }}>empty</span>
      )}
    </span>
  ));

  const sideTargets = side.map((stack, idx) => (
    <span
      key={idx}
      onClick={() => setSelStackIdx(idx)}
      style={{
        display: "inline-block",
        margin: 4,
        padding: 6,
        border: selStackIdx === idx ? "2px solid #1976d2" : "2px solid #ccc",
        borderRadius: 6,
        background: selStackIdx === idx ? "#e3f2fd" : "#fff",
        cursor: "pointer",
        minWidth: 80,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "0.8em", marginBottom: 2 }}>Stack {idx}</div>
      {stack.map((c, j) => (
        <CardView key={j} card={c} />
      ))}
      {stack.length === 0 && <div style={{ color: "#999", fontSize: "0.8em" }}>empty</div>}
    </span>
  ));

  const personalPreview = (
    <div style={{ display: "inline-block", padding: 6, background: "#f5f5f5", borderRadius: 6, margin: 4 }}>
      <strong>Personal pile:</strong> {personal.count} cards
      {personal.top && (
        <>
          {" "}
          (top: <CardView card={personal.top} />)
        </>
      )}
    </div>
  );

  return (
    <div style={{ flex: 1, borderLeft: "1px solid #ccc", padding: 20, overflowY: "auto" }}>
      <h2>🎮 Your turn</h2>

      {/* Draw */}
      <div style={sectionStyle}>
        <button
          onClick={() => sendAction({ type: "draw" })}
          disabled={!canDraw}
          style={canDraw ? buttonStyle : disabledBtn}
        >
          🃏 Draw a card
        </button>
      </div>

      {/* Hand display */}
      <div style={sectionStyle}>
        <strong>🃏 Your hand (click to select)</strong>
        <div style={{ marginTop: 8 }}>
          {hand.length === 0 ? <span style={{ color: "#999" }}>No cards in hand</span> : handCards}
        </div>
      </div>

      {/* Open scale (needs selected hand card) */}
      <div style={sectionStyle}>
        <button
          onClick={() => {
            if (selHandIdx !== null) {
              sendAction({ type: "open_scale", hand_idx: selHandIdx });
            }
          }}
          disabled={selHandIdx === null}
          style={selHandIdx !== null ? buttonStyle : disabledBtn}
        >
          📂 Open new scale with selected card
        </button>
        {selHandIdx === null && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Select a hand card first</span>}
      </div>

      {/* Play hand on existing scale (needs selected hand + selected scale) */}
      <div style={sectionStyle}>
        <strong>🎯 Play hand card on a scale</strong>
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => {
              if (selHandIdx !== null && selScaleIdx !== null) {
                sendAction({ type: "play_hand", hand_idx: selHandIdx, scale_idx: selScaleIdx });
              }
            }}
            disabled={selHandIdx === null || selScaleIdx === null}
            style={selHandIdx !== null && selScaleIdx !== null ? buttonStyle : disabledBtn}
          >
            ▶️ Play selected card on selected scale
          </button>
          {selHandIdx === null && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Select a hand card</span>}
          {selHandIdx !== null && selScaleIdx === null && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Now select a target scale below</span>}
        </div>
      </div>

      {/* Play from personal (needs selected scale) */}
      <div style={sectionStyle}>
        <strong>📦 Play from personal pile</strong>
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => {
              if (selScaleIdx !== null) {
                sendAction({ type: "play_personal", scale_idx: selScaleIdx });
              }
            }}
            disabled={!hasPersonal || selScaleIdx === null}
            style={hasPersonal && selScaleIdx !== null ? buttonStyle : disabledBtn}
          >
            ▶️ Play personal card on selected scale
          </button>
          {!hasPersonal && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Personal pile is empty</span>}
          {hasPersonal && selScaleIdx === null && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Select a target scale</span>}
        </div>
        {personalPreview}
      </div>

      {/* Play from side (needs selected side stack + selected scale) */}
      <div style={sectionStyle}>
        <strong>🃟 Play from side stack</strong>
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => {
              if (selStackIdx !== null && selScaleIdx !== null) {
                sendAction({ type: "play_side", stack_idx: selStackIdx, scale_idx: selScaleIdx });
              }
            }}
            disabled={selStackIdx === null || selScaleIdx === null}
            style={selStackIdx !== null && selScaleIdx !== null ? buttonStyle : disabledBtn}
          >
            ▶️ Play side card on selected scale
          </button>
          {selStackIdx === null && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Select a side stack</span>}
          {selStackIdx !== null && selScaleIdx === null && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Select a target scale</span>}
        </div>
        <div style={{ marginTop: 8 }}>{sideTargets}</div>
      </div>

      {/* Move hand to side (needs selected hand + selected side stack) */}
      <div style={sectionStyle}>
        <strong>➡️ Move hand card to side stack</strong>
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => {
              if (selHandIdx !== null && selStackIdx !== null) {
                sendAction({ type: "move_to_side", hand_idx: selHandIdx, stack_idx: selStackIdx });
              }
            }}
            disabled={selHandIdx === null || selStackIdx === null}
            style={selHandIdx !== null && selStackIdx !== null ? buttonStyle : disabledBtn}
          >
            ▶️ Move selected hand card to selected side
          </button>
          {selHandIdx === null && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Select a hand card</span>}
          {selHandIdx !== null && selStackIdx === null && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Select a side stack</span>}
        </div>
      </div>

      {/* Move personal to side (needs selected side stack) */}
      <div style={sectionStyle}>
        <strong>📦 Move personal → side</strong>
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => {
              if (selStackIdx !== null) {
                sendAction({ type: "move_personal_to_side", stack_idx: selStackIdx });
              }
            }}
            disabled={!hasPersonal || selStackIdx === null}
            style={hasPersonal && selStackIdx !== null ? buttonStyle : disabledBtn}
          >
            ▶️ Move personal pile to selected side stack
          </button>
          {!hasPersonal && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Personal pile is empty</span>}
          {hasPersonal && selStackIdx === null && <span style={{ fontSize: 12, marginLeft: 8, color: "#999" }}>Select a side stack</span>}
        </div>
      </div>

      {/* Scales display (clickable for target selection) */}
      <div style={sectionStyle}>
        <strong>📊 Scales (click to select as target)</strong>
        <div style={{ marginTop: 8 }}>
          {scales.length === 0 ? <span style={{ color: "#999" }}>No scales yet</span> : scaleTargets}
        </div>
      </div>
    </div>
  );
}