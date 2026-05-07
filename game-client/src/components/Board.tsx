import type { FullState } from "../types";
import PlayerArea from "./PlayerArea";
import CardView from "./CardView";

interface Props {
  board: FullState;
  playerId: number;
}

export default function Board({ board, playerId }: Readonly<Props>) {
  return (
    <div style={{ flex: 2 }}>
      <h2>Room: {board.room_idx}</h2>
      <div style={{ marginBottom: 20 }}>
        <strong>Scales:</strong>
        {board.scales.map(s => (
          <div key={s.id} style={{ marginLeft: 10 }}>
            Scale {s.id} ({s.completed ? "✅ completed" : "open"}) owner: {s.owner}
            : {s.cards.map((c, i) => <CardView key={i} card={c} />)}
          </div>
        ))}
      </div>
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