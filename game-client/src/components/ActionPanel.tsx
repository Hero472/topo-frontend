import React from "react";
import type { Card } from "../types";

interface Props {
  sendAction: (action: any) => void;
  isMyTurn: boolean;
  hand: Card[];
  scales: { id: number; cards: Card[] }[]; // adjust as needed
  side: Card[][];
}

export default function ActionPanel({ sendAction, isMyTurn, hand, scales, side }: Props) {
  const [handIdx, setHandIdx] = React.useState(0);
  const [scaleIdx, setScaleIdx] = React.useState(0);
  const [stack, setStack] = React.useState(0);

  if (!isMyTurn) return <div>Waiting for opponent…</div>;

  return (
    <div style={{ flex: 1 }}>
      <h3>Your turn</h3>
      <div>
        <button onClick={() => sendAction("Draw")}>Draw</button>
      </div>
      <div>
        hand_idx:{" "}
        <input
          type="number"
          value={handIdx}
          onChange={(e) => setHandIdx(Number(e.target.value))}
          min={0}
          max={hand.length - 1}
          size={3}
        />
        <button
          onClick={() => sendAction({ OpenScale: { hand_idx: handIdx } })}
          disabled={hand.length === 0}
        >
          Open Scale
        </button>
      </div>
      <div>
        hand_idx: {handIdx} scale_idx:{" "}
        <input
          type="number"
          value={scaleIdx}
          onChange={(e) => setScaleIdx(Number(e.target.value))}
          min={0}
          size={3}
        />
        <button
          onClick={() =>
            sendAction({
              PlayHand: { hand_idx: handIdx, scale_idx: scaleIdx },
            })
          }
        >
          Play on Scale
        </button>
      </div>
      <div>
        stack:{" "}
        <input
          type="number"
          value={stack}
          onChange={(e) => setStack(Number(e.target.value))}
          min={0}
          max={1}
          size={3}
        />{" "}
        scale_idx: {scaleIdx}
        <button
          onClick={() =>
            sendAction({ PlaySide: { stack, scale_idx: scaleIdx } })
          }
        >
          Play Side
        </button>
      </div>
      <div>
        hand_idx: {handIdx} stack: {stack}
        <button
          onClick={() =>
            sendAction({ MoveToSide: { hand_idx: handIdx, stack } })
          }
        >
          Move to Side
        </button>
      </div>
      <div>
        stack_idx: {stack}
        <button
          onClick={() =>
            sendAction({ MovePersonalToSide: { stack_idx: stack } })
          }
        >
          Move Personal → Side
        </button>
      </div>
      <div>
        scale_idx: {scaleIdx}
        <button
          onClick={() => sendAction({ PlayPersonal: { scale_idx: scaleIdx } })}
        >
          Play Personal
        </button>
      </div>
    </div>
  );
}