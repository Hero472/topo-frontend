import { useGameStore } from "../store/useGameStore";
import type { Action, Card, PersonalPile, Scale } from "../types";
import React from "react";

interface Props {
  sendAction: (action: Action) => void;
  isMyTurn: boolean;
  hand: Card[];
  scales: Scale[];
  side: Card[][];
  personal: PersonalPile;
}

export default function ActionPanel({ sendAction, isMyTurn, hand, scales, personal }: Readonly<Props>) {

  const canDraw = useGameStore((s) => s.canDraw);

  const [handIdx, setHandIdx] = React.useState(0);
  const [scaleIdx, setScaleIdx] = React.useState(0);
  const [stackIdx, setStackIdx] = React.useState(0);

  // Helper: get safe index for hand (clamped to valid range)
  const safeHandIdx = hand.length === 0 ? 0 : Math.min(handIdx, hand.length - 1);
  // Helper: get safe index for scale
  const safeScaleIdx = scales.length === 0 ? 0 : Math.min(scaleIdx, scales.length - 1);
  // Stack index is already safe (0 or 1)
  const safeStackIdx = Math.min(1, Math.max(0, stackIdx));

  const hasHand = hand.length > 0;
  const hasScales = scales.length > 0;
  const hasPersonal = personal.count > 0;

  // Clamp input values when they change (no useEffect needed)
  const handleHandIdxChange = (value: number) => {
    const max = Math.max(0, hand.length - 1);
    setHandIdx(Math.min(max, Math.max(0, value)));
  };

  const handleScaleIdxChange = (value: number) => {
    const max = Math.max(0, scales.length - 1);
    setScaleIdx(Math.min(max, Math.max(0, value)));
  };

  const handleStackIdxChange = (value: number) => {
    setStackIdx(Math.min(1, Math.max(0, value)));
  };

  if (!isMyTurn) return <div style={{ padding: 20, textAlign: "center" }}>🕒 Waiting for opponent…</div>;

  const buttonStyle = {
    padding: "6px 12px",
    margin: "4px",
    borderRadius: 6,
    border: "1px solid #ccc",
    background: "#f9f9f9",
    cursor: "pointer",
    fontWeight: "bold" as const,
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: "not-allowed",
  };

  const sectionStyle = {
    marginBottom: 20,
    padding: 12,
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    background: "#fafafa",
  };

  const inputStyle = {
    width: 60,
    margin: "0 8px",
    padding: 4,
    borderRadius: 4,
    border: "1px solid #ccc",
  };

  const labelStyle = {
    display: "inline-block",
    width: 80,
    fontWeight: 500,
  };

  return (
    <div style={{ flex: 1, borderLeft: "1px solid #ccc", padding: 20, overflowY: "auto" }}>
      <h2>🎮 Your turn</h2>

      {/* Draw action */}
      <div style={sectionStyle}>
        <button
          onClick={() => sendAction({ type: "draw" })}
          disabled={!isMyTurn || !canDraw}
        >
          🃏 Draw a card
        </button>
      </div>

      {/* Open Scale */}
      <div style={sectionStyle}>
        <strong>📂 Open a new scale</strong>
        <div>
          <span style={labelStyle}>Hand card index:</span>
          <input
            type="number"
            value={handIdx}
            min={0}
            max={Math.max(0, hand.length - 1)}
            onChange={(e) => handleHandIdxChange(Number(e.target.value))}
            style={inputStyle}
            disabled={!hasHand}
          />
          <span style={{ marginLeft: 8 }}>
            {hasHand ? `${hand[safeHandIdx].value}${hand[safeHandIdx].suit}` : "—"}
          </span>
          <button
            style={hasHand ? buttonStyle : disabledButtonStyle}
            onClick={() => sendAction({ type: "openScale", hand_idx: safeHandIdx })}
            disabled={!hasHand}
          >
            Open Scale
          </button>
        </div>
      </div>

      {/* Play hand card on existing scale */}
      <div style={sectionStyle}>
        <strong>🎯 Play hand card on scale</strong>
        <div>
          <span style={labelStyle}>Hand card idx:</span>
          <input
            type="number"
            value={handIdx}
            min={0}
            max={Math.max(0, hand.length - 1)}
            onChange={(e) => handleHandIdxChange(Number(e.target.value))}
            style={inputStyle}
            disabled={!hasHand}
          />
          <span style={{ marginLeft: 8 }}>
            {hasHand ? `${hand[safeHandIdx].value}${hand[safeHandIdx].suit}` : "—"}
          </span>
        </div>
        <div>
          <span style={labelStyle}>Target scale idx:</span>
          <input
            type="number"
            value={scaleIdx}
            min={0}
            max={Math.max(0, scales.length - 1)}
            onChange={(e) => handleScaleIdxChange(Number(e.target.value))}
            style={inputStyle}
            disabled={!hasScales}
          />
          <button
            style={hasHand && hasScales ? buttonStyle : disabledButtonStyle}
            onClick={() =>
              sendAction({ type: "playHand", hand_idx: safeHandIdx, scale_idx: safeScaleIdx })
            }
            disabled={!hasHand || !hasScales}
          >
            Play on Scale
          </button>
        </div>
      </div>

      {/* Play from personal pile */}
      <div style={sectionStyle}>
        <strong>📦 Play from personal pile</strong>
        <div>
          <span style={labelStyle}>Target scale idx:</span>
          <input
            type="number"
            value={scaleIdx}
            min={0}
            max={Math.max(0, scales.length - 1)}
            onChange={(e) => handleScaleIdxChange(Number(e.target.value))}
            style={inputStyle}
            disabled={!hasScales}
          />
          <button
            style={hasPersonal && hasScales ? buttonStyle : disabledButtonStyle}
            onClick={() => sendAction({ type: "playPersonal", scale_idx: safeScaleIdx })}
            disabled={!hasPersonal || !hasScales}
          >
            Play Personal
          </button>
          <div style={{ fontSize: 12, marginTop: 4 }}>Personal pile size: {personal.count}</div>
        </div>
      </div>

      {/* Play from side stack */}
      <div style={sectionStyle}>
        <strong>🃟 Play from side stack</strong>
        <div>
          <span style={labelStyle}>Side stack (0=left,1=right):</span>
          <input
            type="number"
            value={stackIdx}
            min={0}
            max={1}
            onChange={(e) => handleStackIdxChange(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div>
          <span style={labelStyle}>Target scale idx:</span>
          <input
            type="number"
            value={scaleIdx}
            min={0}
            max={Math.max(0, scales.length - 1)}
            onChange={(e) => handleScaleIdxChange(Number(e.target.value))}
            style={inputStyle}
            disabled={!hasScales}
          />
          <button
            style={hasScales ? buttonStyle : disabledButtonStyle}
            onClick={() =>
              sendAction({ type: "playSide", stack: safeStackIdx, scale_idx: safeScaleIdx })
            }
            disabled={!hasScales}
          >
            Play Side
          </button>
        </div>
      </div>

      {/* Move hand card to side stack */}
      <div style={sectionStyle}>
        <strong>➡️ Move hand card to side</strong>
        <div>
          <span style={labelStyle}>Hand card idx:</span>
          <input
            type="number"
            value={handIdx}
            min={0}
            max={Math.max(0, hand.length - 1)}
            onChange={(e) => handleHandIdxChange(Number(e.target.value))}
            style={inputStyle}
            disabled={!hasHand}
          />
          <span style={{ marginLeft: 8 }}>
            {hasHand ? `${hand[safeHandIdx].value}${hand[safeHandIdx].suit}` : "—"}
          </span>
        </div>
        <div>
          <span style={labelStyle}>Target side stack:</span>
          <input
            type="number"
            value={stackIdx}
            min={0}
            max={1}
            onChange={(e) => handleStackIdxChange(Number(e.target.value))}
            style={inputStyle}
          />
          <button
            style={hasHand ? buttonStyle : disabledButtonStyle}
            onClick={() =>
              sendAction({ type: "moveToSide", hand_idx: safeHandIdx, stack: safeStackIdx })
            }
            disabled={!hasHand}
          >
            Move to Side
          </button>
        </div>
      </div>

      {/* Move personal pile to side stack */}
      <div style={sectionStyle}>
        <strong>📦 Move personal → side</strong>
        <div>
          <span style={labelStyle}>Target side stack:</span>
          <input
            type="number"
            value={stackIdx}
            min={0}
            max={1}
            onChange={(e) => handleStackIdxChange(Number(e.target.value))}
            style={inputStyle}
          />
          <button
            style={hasPersonal ? buttonStyle : disabledButtonStyle}
            onClick={() =>
              sendAction({ type: "movePersonalToSide", stack_idx: safeStackIdx })
            }
            disabled={!hasPersonal}
          >
            Move Personal → Side
          </button>
          <div style={{ fontSize: 12, marginTop: 4 }}>Personal pile size: {personal.count}</div>
        </div>
      </div>
    </div>
  );
}