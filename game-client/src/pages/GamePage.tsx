import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";
import { useRoomStore } from "../store/useRoomStore";
import { useGameSocket } from "../hooks/useGameSocket"; // Keep imported for the type

import GameBoard from "../components/game/GameBoard";
import DragOverlay from "../components/overlay/DragOverlay";
import ConnectionStatusOverlay from "../components/overlay/ConnectionStatusOverlay";

import { t, useLanguage } from "../i18n";
import "./GamePage.css";

// ✅ Accept socket as a prop
export default function GamePage({ 
  socket 
}: Readonly<{ 
  socket: ReturnType<typeof useGameSocket> 
}>) {
  useLanguage();
  
  const navigate = useNavigate();

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const fullState = useGameStore((s) => s.fullState);
  const turnTimeoutMessage = useGameStore((s) => s.turnTimeoutMessage);

  const phase = useRoomStore((s) => s.phase);
  const winnerId = useRoomStore((s) => s.winnerId);
  const reason = useRoomStore((s) => s.reason);
  const playAgainRequestedBy = useRoomStore((s) => s.playAgainRequestedBy);

  const playAgain = () => {
    socket.sendAction({ type: "play_again" });
  };

  const handleLeave = () => {
    useRoomStore.getState().reset();
    useGameStore.getState().reset();
    socket.leaveGame(); // ✅ Use the socket's leaveGame method
    navigate("/", { replace: true });
  };

  if (!fullState) {
    const isConnecting = socket.status === "connecting";
    return (
      <div className="game-page">
        <div className="game-loading">
          <div className="game-loading-icon" aria-hidden="true">
            {isConnecting ? "🃏" : "♠"}
          </div>
          <div className="game-loading-text">
            {isConnecting ? t("game.loading.connecting") : t("game.loading.waiting")}
          </div>
          <p className="game-loading-subtext">
            {isConnecting ? t("game.loading.joiningRoom") : t("game.loading.waitingForPlayers")}
          </p>
        </div>
      </div>
    );
  }

  const isGameOver = phase === "over" && winnerId !== null;
  const isWinner = winnerId === fullState.player_id;

  const opponentRequestedPlayAgain =
    playAgainRequestedBy.size > 0 && !playAgainRequestedBy.has(fullState.player_id);

  const iRequestedPlayAgain = playAgainRequestedBy.has(fullState.player_id);

  return (
    <div className="game-page game-board-container">
      <GameBoard sendAction={socket.sendAction} />

      {!isGameOver && <DragOverlay />}

      <button
        type="button"
        className="game-leave-button"
        onClick={() => setShowLeaveConfirm(true)}
      >
        {t("game.leave.button")}
      </button>

      <ConnectionStatusOverlay status={socket.status} />

      {isGameOver && (
        <div className="game-over-backdrop">
          <div className="game-over-dialog" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
            <h2 id="game-over-title">
              {isWinner ? t("game.over.youWon") : t("game.over.youLost")}
            </h2>

            {reason && <p className="game-over-message">{reason}</p>}
            {turnTimeoutMessage && <p className="game-over-message">{turnTimeoutMessage}</p>}

            {opponentRequestedPlayAgain && (
              <p className="game-over-message">{t("game.over.opponentWantsRematch")}</p>
            )}

            {iRequestedPlayAgain ? (
              <p className="game-over-message">{t("game.over.waitingForOpponent")}</p>
            ) : (
              <button type="button" className="game-play-again-button" onClick={playAgain}>
                {t("game.over.playAgain")}
              </button>
            )}

            <button type="button" className="game-leave-button" onClick={handleLeave}>
              {t("game.leave.button")}
            </button>
          </div>
        </div>
      )}

      {showLeaveConfirm && (
        <div className="leave-dialog-backdrop">
          <div className="leave-dialog" role="dialog" aria-modal="true" aria-labelledby="leave-dialog-title">
            <h2 id="leave-dialog-title">{t("game.leave.title")}</h2>
            <p>{t("game.leave.message")}</p>
            <div className="leave-dialog-actions">
              <button type="button" className="leave-cancel-button" onClick={() => setShowLeaveConfirm(false)}>
                {t("game.leave.cancel")}
              </button>
              <button type="button" className="leave-confirm-button" onClick={handleLeave}>
                {t("game.leave.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}