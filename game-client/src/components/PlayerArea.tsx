import type { PlayerBoard, OpponentBoard } from "../types";

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
        padding: 10,
        minWidth: 250,
        background: isTurn ? "#e0ffe0" : "#f9f9f9",
      }}
    >
      <h3>
        {label}: {board.username} {isTurn ? "⚡" : ""}
      </h3>
      <div>
        <strong>Hand:</strong>{" "}
        {isSelfBoard
          ? (board as PlayerBoard).hand.map((c, i) => (
              <span key={i} style={{ marginRight: 5 }}>
                {c.rank}
                {c.suit}
              </span>
            ))
          : (board as OpponentBoard).hand_count}
      </div>
      <div>
        <strong>Personal:</strong>{" "}
        {isSelfBoard
          ? (board as PlayerBoard).personal.map((c, i) => (
              <span key={i}>{c.rank}{c.suit}</span>
            ))
          : (board as OpponentBoard).personal_count}
      </div>
      <div>
        <strong>Side:</strong>
        {board.side.map((stack, i) => (
          <div key={i}>
            Stack {i}: {stack.map(c => `${c.rank}${c.suit}`).join(" ")}
          </div>
        ))}
      </div>
    </div>
  );
}