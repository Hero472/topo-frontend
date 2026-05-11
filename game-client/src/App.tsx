import { GameProvider } from "./context/GameProvider";
import { useGameSocket } from "./hooks/useGameSocket";
import Board from "./components/Board";
import ActionPanel from "./components/ActionPanel";
import { useGameContext } from "./hooks/useGameContext";
import { useEffect, useState } from "react";

function TurnTimer({ initialSeconds }: { initialSeconds: number }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // runs only on mount (which is controlled by the key in the parent)

  return <span>⏳ Your turn – {timeLeft}s left</span>;
}

function Game() {
  const params = new URLSearchParams(globalThis.location.search);
  const room = params.get("room") || "test";
  const playerId = Number(params.get("player_id")) || 1;
  const username = params.get("username") || "Anonymous";

  const { sendAction } = useGameSocket(room, playerId, username);
  const { state } = useGameContext();
  const { fullState, winnerId } = state;

  // ───── Turn timer ─────
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    console.log('🎮 FullState updated:', state.fullState);
  }, [state.fullState]);

  // Countdown effect
  useEffect(() => {
    if (!fullState || !fullState.your_turn || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [fullState?.your_turn, timeLeft]);

  // ───── Render ─────
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

  const isMyTurn = fullState.your_turn;

  const turnKey = `${fullState.your_turn}_${fullState.turn_seconds_remaining}`;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ textAlign: "center", fontSize: "1.5em", fontWeight: "bold" }}>
        {isMyTurn ? (
          <TurnTimer key={turnKey} initialSeconds={fullState.turn_seconds_remaining} />
        ) : (
          <>🕒 Waiting for opponent…</>
        )}
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        <Board board={fullState} playerId={playerId} />
        <ActionPanel
          sendAction={sendAction}
          isMyTurn={isMyTurn}
          hand={fullState.your_board.hand}
          personal={fullState.your_board.personal}
          scales={fullState.scales}
          side={fullState.your_board.side}
        />
      </div>
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
  const params = new URLSearchParams(globalThis.location.search);
  const hasParams = params.has("player_id");

  if (!hasParams) {
    return <JoinScreen />;
  }
  return <GameProvider><Game/></GameProvider>;
}