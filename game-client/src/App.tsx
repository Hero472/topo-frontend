import { GameProvider, useGameContext } from "./context/GameContext";
import { useGameSocket } from "./hooks/useGameSocket";
import Board from "./components/Board";
import ActionPanel from "./components/ActionPanel";

function Game() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room") || "test";
  const playerId = Number(params.get("player_id")) || 1;
  const username = params.get("username") || "Anonymous";

  const { sendAction } = useGameSocket(room, playerId, username);
  const { state } = useGameContext();
  const { fullState, winnerId } = state;

  if (!fullState) return <div>Connecting…</div>;
  if (winnerId !== null)
    return (
      <div style={{ textAlign: "center", fontSize: "2em" }}>
        🎉 Player {winnerId} wins!
      </div>
    );

  const isMyTurn = fullState.current_turn === playerId;

  return (
    <div style={{ padding: 20, display: "flex", gap: 40 }}>
      <Board board={fullState} playerId={playerId} />
      <ActionPanel
        sendAction={sendAction}
        isMyTurn={isMyTurn}
        hand={fullState.self.hand}
        scales={fullState.self.scales ?? []} // depends on your FullState
        side={fullState.self.side}
      />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}