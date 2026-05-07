import type { PlayerBoard, OpponentBoard } from "../types";
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
      <h3>{label}: {board.username} {isTurn && "⚡"}</h3>
      <div>
        <strong>Hand:</strong>{" "}
        {isSelfBoard
          ? (board as PlayerBoard).hand.map((c, i) => <CardView key={i} card={c} />)
          : (board as OpponentBoard).hand_count}
      </div>
      <div>
        <strong>Personal:</strong>{" "}
        {isSelfBoard
          ? (board as PlayerBoard).personal.map((c, i) => <CardView key={i} card={c} />)
          : `${(board as OpponentBoard).personal_count} card(s)`}
        {!isSelfBoard && (board as OpponentBoard).personal_top && (
          <span style={{ marginLeft: 6 }}>(top: <CardView card={(board as OpponentBoard).personal_top!} />)</span>
        )}
      </div>
      <div>
        <strong>Side:</strong>
        {board.side.map((stack, i) => (
          <div key={i} style={{ marginLeft: 10 }}>
            Stack {i}: {stack.map((c, j) => <CardView key={j} card={c} />)}
          </div>
        ))}
      </div>
    </div>
  );
}