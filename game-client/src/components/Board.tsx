import type { FullState } from "../types";
import PlayerArea from "./PlayerArea";

interface Props {
  board: FullState;
  playerId: number;
}

export default function Board({ board, playerId }: Props) {
  return (
    <div style={{ flex: 2 }}>
      <h2>Room: {board.room_id}</h2>
      <div style={{ display: "flex", gap: 30 }}>
        <PlayerArea
          label="You"
          board={board.self}
          isSelf={true}
          isTurn={board.current_turn === playerId}
        />
        <PlayerArea
          label="Opponent"
          board={board.opponent}
          isSelf={false}
          isTurn={board.current_turn !== playerId}
        />
      </div>
    </div>
  );
}