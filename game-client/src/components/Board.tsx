import type { FullState } from "../types/types";
import PlayerArea from "./PlayerArea";

interface Props {
  board: FullState;
}

export default function Board({ board }: Props) {
  return (
    <div style={{ flex: 2 }}>
      <h2>Room: {board.your_board.player_idx}</h2>{" "}
      {/* or a room_id if you add it */}
      <div style={{ display: "flex", gap: 30 }}>
        <PlayerArea
          label="You"
          board={board.your_board}
          isSelf={true}
          isTurn={board.your_turn}
        />
        <PlayerArea
          label="Opponent"
          board={board.opponent}
          isSelf={false}
          isTurn={!board.your_turn}
        />
      </div>
    </div>
  );
}
