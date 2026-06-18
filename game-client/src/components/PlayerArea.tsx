import type { PlayerBoard, OpponentBoard } from "../types/types";
import CardView from "./CardView";

interface Props {
  label: string;
  board: PlayerBoard | OpponentBoard;
  isSelf: boolean;
  isTurn: boolean;
}

export default function PlayerArea({ label, board, isSelf, isTurn }: Props) {
  const isSelfBoard = isSelf && "hand" in board;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 12,
        minWidth: 250,
        background: isTurn ? "#e0ffe0" : "#fafafa",
      }}
    >
      <h3>
        {label}: {board.username} {isTurn && "⚡"}
      </h3>

      {/* Hand – only visible for self */}
      <div>
        <strong>Hand:</strong>{" "}
        {isSelfBoard
          ? board.hand.map((c, i) => <CardView key={i} card={c} />)
          : `???`}
      </div>

      {/* Personal – different for self vs opponent, JSX-safe */}
      <div>
        <strong>Personal:</strong>{" "}
        {isSelfBoard ? (
          <>
            {board.personal.count} cards
            {board.personal.top && (
              <>
                {" "}
                (top: <CardView card={board.personal.top} />)
              </>
            )}
          </>
        ) : (
          <>
            {(board as OpponentBoard).personal_count} card(s)
            {(board as OpponentBoard).personal_top && (
              <>
                {" "}
                (top: <CardView card={(board as OpponentBoard).personal_top!} />
                )
              </>
            )}
          </>
        )}
      </div>

      {/* Side stacks – same for both */}
      <div>
        <strong>Side:</strong>
        {board.side.map((stack, i) => (
          <div key={i} style={{ marginLeft: 10 }}>
            Stack {i}:{" "}
            {stack.map((c, j) => (
              <CardView key={j} card={c} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
