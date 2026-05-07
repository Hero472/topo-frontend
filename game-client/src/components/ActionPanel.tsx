import { useState } from "react";
import type { Action, Card, Scale } from "../types";

interface Props {
  sendAction: (action: Action) => void;
  isMyTurn: boolean;
  hand: Card[];
  scales: Scale[];
  side: Card[][];
  personal: Card[];
}

export default function ActionPanel({ sendAction, isMyTurn, hand, personal }: Readonly<Props>) {
  const [handIdx, setHandIdx] = useState(0);
  const [scaleIdx, setScaleIdx] = useState(0);
  const [stack, setStack] = useState(0);

  if (!isMyTurn) return <div style={{ flex:1 }}>🕒 Waiting for opponent…</div>;

  return (
    <div style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: 20 }}>
      <h3>Your turn</h3>

      {/* Draw */}
      <button onClick={() => sendAction("Draw")} style={{ marginBottom: 6 }}>🃏 Draw</button>

      <hr />

      {/* Open Scale */}
      <div>
        <input
          type="number"
          value={handIdx}
          min={0}
          max={hand.length - 1}
          onChange={e => setHandIdx(Number(e.target.value))}
          size={3}
        />
        <button
          onClick={() => sendAction({ OpenScale: { hand_idx: handIdx } })}
          disabled={hand.length === 0}
        >
          Open Scale (hand[{handIdx}])
        </button>
      </div>

      {/* Play on Scale */}
      <div style={{ marginTop: 6 }}>
        hand: {handIdx}
        <input
          type="number"
          value={scaleIdx}
          min={0}
          onChange={e => setScaleIdx(Number(e.target.value))}
          size={3}
        />
        <button
          onClick={() => sendAction({ PlayHand: { hand_idx: handIdx, scale_idx: scaleIdx } })}
          disabled={hand.length === 0}
        >
          Play on Scale
        </button>
      </div>

      {/* Play Personal */}
      <div style={{ marginTop: 6 }}>
        <button
          onClick={() => sendAction({ PlayPersonal: { scale_idx: scaleIdx } })}
          disabled={personal.length === 0}
        >
          Play Personal (scale {scaleIdx})
        </button>
      </div>

      {/* Play Side */}
      <div style={{ marginTop: 6 }}>
        stack:
        <input
          type="number"
          value={stack}
          min={0}
          max={1}
          onChange={e => setStack(Number(e.target.value))}
          size={3}
        />
        scale: {scaleIdx}
        <button
          onClick={() => sendAction({ PlaySide: { stack, scale_idx: scaleIdx } })}
        >
          Play Side
        </button>
      </div>

      {/* Move to Side */}
      <div style={{ marginTop: 6 }}>
        hand: {handIdx}
        stack: {stack}
        <button
          onClick={() => sendAction({ MoveToSide: { hand_idx: handIdx, stack } })}
          disabled={hand.length === 0}
        >
          Move to Side
        </button>
      </div>

      {/* Move Personal to Side */}
      <div style={{ marginTop: 6 }}>
        personal stack idx:
        <input
          type="number"
          value={stack}
          min={0}
          max={1}
          onChange={e => setStack(Number(e.target.value))}
          size={3}
        />
        <button
          onClick={() => sendAction({ MovePersonalToSide: { stack_idx: stack } })}
          disabled={personal.length === 0}
        >
          Move Personal → Side
        </button>
      </div>
    </div>
  );
}