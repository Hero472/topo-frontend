import { GameProvider } from "./context/GameProvider";
import { useGameSocket } from "./hooks/useGameSocket";
import Board from "./components/Board";
import ActionPanel from "./components/ActionPanel";
import { useGameContext } from "./hooks/useGameContext";
import { useEffect } from "react";

function Game() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room") || "test";
  const playerId = Number(params.get("player_id")) || 1;
  const username = params.get("username") || "Anonymous";

  const { sendAction } = useGameSocket(room, playerId, username);
  const { state } = useGameContext();
  const { fullState, winnerId } = state;

  useEffect(() => {
    console.log('🎮 FullState updated:', state.fullState);
  }, [state.fullState]);

  if (!fullState) return <div>🔄 Connecting…</div>;
  if (winnerId !== null)
    return (
      <div style={{ textAlign: "center", fontSize: "2em", marginTop: 50 }}>
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
        personal={fullState.self.personal}
        scales={fullState.scales}
        side={fullState.self.side}
      />
    </div>
  );
}

function JoinScreen() {
  const room = "myroom";
  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Join Game</h2>
      <a href={`?room=${room}&player_id=1&username=Alice`}>
        Join as Alice
      </a>
      <br />
      <a href={`?room=${room}&player_id=2&username=Bob`}>
        Join as Bob
      </a>
    </div>
  );
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const hasParams = params.has("player_id"); // or any required param

  if (!hasParams) {
    return <JoinScreen />;
  }
  return <GameProvider><Game /></GameProvider>;
}