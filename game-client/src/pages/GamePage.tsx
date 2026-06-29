// GamePage.tsx
import { useEffect } from "react";
import { useGameSocket } from "../hooks/useGameSocket";
import { useGameStore } from "../store/useGameStore";
import TurnTimer from "../components/TurnTimer";
import Board from "../components/Board";
import ActionPanel from "../components/ActionPanel";

export function GamePage() {
  const params = new URLSearchParams(globalThis.location.search);
  const room = params.get("room")!;
  const username = params.get("username")!;

  const { sendAction, status, error } = useGameSocket(room, username);
  const fullState = useGameStore((s) => s.fullState);
  const winnerId = useGameStore((s) => s.winnerId);
  const timeoutMessage = useGameStore((s) => s.timeoutMessage);
  const clearTimeoutMessage = useGameStore((s) => s.clearTimeoutMessage);

  useEffect(() => {
    if (timeoutMessage) {
      const timer = setTimeout(() => clearTimeoutMessage(), 5000);
      return () => clearTimeout(timer);
    }
  }, [timeoutMessage, clearTimeoutMessage]);

  // ── Loading state ──
  if (!fullState) {
    return (
      <div style={styles.container}>
        <ConnectionBanner status={status} error={error} />
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p>Loading game state…</p>
        </div>
      </div>
    );
  }

  // ── Game over screen ──
  if (winnerId !== null) {
    return (
      <div style={styles.container}>
        <ConnectionBanner status={status} error={error} />
        <div style={styles.overlay}>
          <div style={styles.winCard}>
            <h1>🎉 Game Over</h1>
            <p style={{ fontSize: "1.2rem", margin: "16px 0" }}>
              <strong>{username === winnerId ? "You win!" : `${winnerId} wins!`}</strong>
            </p>
            <button style={styles.button} onClick={() => window.location.reload()}>
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active game ──
  const isMyTurn = fullState.your_turn;
  const turnKey = `${fullState.your_turn}_${fullState.turn_seconds_remaining}`;

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <ConnectionIndicator status={status} error={error} />
        <div style={styles.roomInfo}>Room: {room}</div>
        <div style={styles.playerInfo}>You: {username}</div>
      </div>

      {/* Timeout banner */}
      {timeoutMessage && (
        <div style={styles.timeoutBanner}>{timeoutMessage}</div>
      )}

      {/* Turn timer */}
      <div style={styles.timerArea}>
        {isMyTurn ? (
          <TurnTimer key={turnKey} initialSeconds={fullState.turn_seconds_remaining} />
        ) : (
          <div style={styles.waiting}>🕒 Waiting for opponent…</div>
        )}
      </div>

      {/* Main game area */}
      <div style={styles.gameArea}>
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

// ── Sub-components ──

function ConnectionBanner({ status, error }: { status: string; error: string | null }) {
  return (
    <div style={styles.banner}>
      {status === "connecting" && "🔄 Connecting…"}
      {status === "open" && "🟢 Connected"}
      {status === "closed" && "🔴 Disconnected"}
      {error && <span style={{ color: "#ff6b6b", marginLeft: 8 }}>⚠️ {error}</span>}
    </div>
  );
}

function ConnectionIndicator({ status, error }: { status: string; error: string | null }) {
  const color =
    status === "open" ? "#2ecc71" : status === "connecting" ? "#f1c40f" : "#e74c3c";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color }} />
      <span style={{ fontSize: "0.85rem" }}>
        {status === "open" ? "Live" : status === "connecting" ? "Connecting" : "Offline"}
      </span>
      {error && <span style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>⚠️</span>}
    </div>
  );
}

// ── Styles ──

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    color: "#fff",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  roomInfo: { fontWeight: 600, fontSize: "0.9rem", opacity: 0.9 },
  playerInfo: { fontWeight: 600, fontSize: "0.9rem", opacity: 0.9 },
  timerArea: {
    textAlign: "center",
    padding: "16px 0 8px",
    fontSize: "1.4rem",
    fontWeight: 700,
  },
  waiting: { opacity: 0.7, fontSize: "1.1rem" },
  gameArea: {
    display: "flex",
    flex: 1,
    padding: "0 24px 24px",
    gap: 24,
    overflow: "auto",
  },
  loading: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid rgba(255,255,255,0.2)",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  overlay: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  winCard: {
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(12px)",
    borderRadius: 16,
    padding: "48px 64px",
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    padding: "12px 32px",
    fontSize: "1rem",
    fontWeight: 700,
    backgroundColor: "#e63946",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  timeoutBanner: {
    background: "#ffc107",
    color: "#000",
    padding: "8px 16px",
    textAlign: "center",
    fontWeight: "bold",
  },
  banner: {
    textAlign: "center",
    padding: "6px 16px",
    fontSize: "0.9rem",
    background: "rgba(0,0,0,0.3)",
  },
};