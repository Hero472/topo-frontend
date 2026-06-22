import type { PlayerBoard, OpponentBoard } from "../types/types";
import CardView from "./CardView";

interface Props {
  label: string;   // "You" or "Opponent"
  board: PlayerBoard | OpponentBoard;
  isSelf: boolean; // derived from the board type, but kept for semantic clarity
  isTurn: boolean;
}

// Type guard to narrow the union
function isPlayerBoard(board: PlayerBoard | OpponentBoard): board is PlayerBoard {
  return "hand" in board;
}

export default function PlayerArea({ label, board, isTurn }: Readonly<Props>) {
  const playerBoard = isPlayerBoard(board);

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
        {label}
        {playerBoard ? null : <>: {board.username}</>} {isTurn && "⚡"}
      </h3>

      {/* Hand – only visible for the local player */}
      <div>
        <strong>Hand:</strong>{" "}
        {playerBoard
          ? board.hand.map((c, i) => <CardView key={i} card={c} />)
          : "???"}
      </div>

      {/* Personal pile */}
      <div>
        <strong>Personal:</strong>{" "}
        {playerBoard ? (
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
            {board.personal_count} card(s)
            {board.personal_top && (
              <>
                {" "}
                (top: <CardView card={board.personal_top} />)
              </>
            )}
          </>
        )}
      </div>

      {/* Side stacks – identical for both players */}
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