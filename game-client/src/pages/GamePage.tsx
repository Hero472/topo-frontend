// ── GamePage.tsx ──
import { useEffect } from "react";
import { useGameSocket } from "../hooks/useGameSocket";
import { useGameStore } from "../store/useGameStore";
import TurnTimer from "../components/TurnTimer";
import Board from "../components/Board";
import ActionPanel from "../components/ActionPanel";

export function GamePage() {
  // These params are guaranteed to exist (checked in App)
  const params = new URLSearchParams(globalThis.location.search);
  const room = params.get("room")!;
  const username = params.get("username")!;

  const { sendAction, status, error } = useGameSocket(room, username);

  // Store selectors
  const fullState = useGameStore((s) => s.fullState);
  const winnerId = useGameStore((s) => s.winnerId);
  const timeoutMessage = useGameStore((s) => s.timeoutMessage);
  const clearTimeoutMessage = useGameStore((s) => s.clearTimeoutMessage);

  // Auto‑clear the timeout banner after 5 seconds
  useEffect(() => {
    if (timeoutMessage) {
      const timer = setTimeout(() => clearTimeoutMessage(), 5000);
      return () => clearTimeout(timer);
    }
  }, [timeoutMessage, clearTimeoutMessage]);

  // ── Connection banner ──
  const connectionInfo = (
    <div style={{ textAlign: "center", padding: 8, fontSize: "0.9em" }}>
      {status === "connecting" && "🔄 Connecting to server…"}
      {status === "open" && "🟢 Connected"}
      {status === "closed" && "🔴 Disconnected (reconnecting…)"}
      {error && <span style={{ color: "red", marginLeft: 10 }}>⚠️ {error}</span>}
    </div>
  );

  // ── Loading state ──
  if (!fullState) {
    return (
      <>
        {connectionInfo}
        <div style={{ textAlign: "center", marginTop: 50 }}>Loading game state…</div>
      </>
    );
  }

  // ── Game over screen ──
  if (winnerId !== null) {
    return (
      <>
        {connectionInfo}
        <div style={{ textAlign: "center", fontSize: "2em", marginTop: 50 }}>
          🎉 Player {winnerId} wins!
        </div>
      </>
    );
  }

  // ── Active game ──
  const isMyTurn = fullState.your_turn;
  const turnKey = `${fullState.your_turn}_${fullState.turn_seconds_remaining}`;

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
      {connectionInfo}

      {timeoutMessage && (
        <div
          style={{
            background: "#ffc107",
            color: "#000",
            padding: "8px 16px",
            borderRadius: 4,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {timeoutMessage}
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: "1.5em", fontWeight: "bold" }}>
        {isMyTurn ? (
          <TurnTimer key={turnKey} initialSeconds={fullState.turn_seconds_remaining} />
        ) : (
          "🕒 Waiting for opponent…"
        )}
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        <Board board={fullState} />
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