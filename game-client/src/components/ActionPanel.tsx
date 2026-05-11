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

export default function ActionPanel({ sendAction, isMyTurn, hand, personal }: Readonly<Props>) {
  const [handIdx, setHandIdx] = React.useState(0);
  const [scaleIdx, setScaleIdx] = React.useState(0);
  const [stack, setStack] = React.useState(0);

  if (!isMyTurn) return <div>🕒 Waiting for opponent…</div>;

  return (
    <div style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: 20 }}>
      <h3>Your turn</h3>

      {/* Draw */}
      <button onClick={() => sendAction({ type: "draw" })}>🃏 Draw</button>

      {/* OpenScale */}
      <div>
        <input type="number" value={handIdx} min={0} max={hand.length - 1}
          onChange={e => setHandIdx(Number(e.target.value))} size={3} />
        <button
          onClick={() => sendAction({ type: "openScale", hand_idx: handIdx })}
          disabled={hand.length === 0}
        >
          Open Scale
        </button>
      </div>

      {/* PlayHand */}
      <div>
        hand: {handIdx}
        <input type="number" value={scaleIdx} min={0}
          onChange={e => setScaleIdx(Number(e.target.value))} size={3} />
        <button
          onClick={() => sendAction({ type: "playHand", hand_idx: handIdx, scale_idx: scaleIdx })}
          disabled={hand.length === 0}
        >
          Play on Scale
        </button>
      </div>

      {/* PlayPersonal */}
      <div>
        scale: {scaleIdx}
        <button
          onClick={() => sendAction({ type: "playPersonal", scale_idx: scaleIdx })}
          disabled={personal.count === 0}
        >
          Play Personal
        </button>
      </div>

      {/* PlaySide */}
      <div>
        stack:
        <input type="number" value={stack} min={0} max={1}
          onChange={e => setStack(Number(e.target.value))} size={3} />
        scale: {scaleIdx}
        <button
          onClick={() => sendAction({ type: "playSide", stack, scale_idx: scaleIdx })}
        >
          Play Side
        </button>
      </div>

      {/* MoveToSide */}
      <div>
        hand: {handIdx} stack: {stack}
        <button
          onClick={() => sendAction({ type: "moveToSide", hand_idx: handIdx, stack })}
          disabled={hand.length === 0}
        >
          Move to Side
        </button>
      </div>

      {/* MovePersonalToSide */}
      <div>
        personal stack idx:
        <input type="number" value={stack} min={0} max={1}
          onChange={e => setStack(Number(e.target.value))} size={3} />
        <button
          onClick={() => sendAction({ type: "movePersonalToSide", stack_idx: stack })}
          disabled={personal.count === 0}
        >
          Move Personal → Side
        </button>
      </div>
    </div>
  );
}