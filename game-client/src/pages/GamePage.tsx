import { useGameSocket } from "../hooks/useGameSocket";
import { useGameStore } from "../store/useGameStore";
import GameBoard from "../components/game/GameBoard";
import "./GamePage.css";

export default function GamePage() {
  const room = new URLSearchParams(globalThis.location.search).get("room") ?? "";
  const username = new URLSearchParams(globalThis.location.search).get("username") ?? "";

  const { sendAction, status } = useGameSocket(room, username);
  const fullState = useGameStore((s) => s.fullState);

  if (!fullState || status !== "open") {
    return (
      <div className="game-page">
        <div className="game-loading">
          <div className="game-loading-icon" aria-hidden="true">
            {status === "connecting" ? "🃏" : "♠️"}
          </div>
          <div className="game-loading-text">
            {status === "connecting" ? "Connecting…" : "Waiting for game state…"}
          </div>
          <p className="game-loading-subtext">
            {status === "connecting"
              ? "Joining room, please wait"
              : "The game will start once both players are ready"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page game-board-container">
      <GameBoard sendAction={sendAction} />
    </div>
  );
}