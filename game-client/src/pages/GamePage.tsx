import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useGameSocket } from "../hooks/useGameSocket";

import { useGameStore } from "../store/useGameStore";

import GameBoard from "../components/game/GameBoard";

import DragOverlay from "../components/overlay/DragOverlay";

import ConnectionStatusOverlay from "../components/overlay/ConnectionStatusOverlay";

import { t, useLanguage } from "../i18n";

import "./GamePage.css";

export default function GamePage() {
  useLanguage();

  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const username = sessionStorage.getItem("game-username") ?? "";

  const { sendAction, status, leaveGame } = useGameSocket(
    gameId ?? "",
    username,
  );

  const fullState = useGameStore((s) => s.fullState);
  const winnerId = useGameStore((s) => s.winnerId);
  const timeoutMessage = useGameStore((s) => s.timeoutMessage);
  const playAgainRequestedBy = useGameStore(
    (s) => s.playAgainRequestedBy,
  );

  const playAgain = () => {
    sendAction({
      type: "play_again",
    });
  };

  const handleLeave = () => {
    leaveGame();
    navigate("/", { replace: true });
  };

  /*
   * We don't have FullState yet.
   */
  if (!fullState) {
    const isConnecting = status === "connecting";

    return (
      <div className="game-page">
        <div className="game-loading">
          <div className="game-loading-icon" aria-hidden="true">
            {isConnecting ? "🃏" : "♠"}
          </div>

          <div className="game-loading-text">
            {isConnecting
              ? t("game.loading.connecting")
              : t("game.loading.waiting")}
          </div>

          <p className="game-loading-subtext">
            {isConnecting
              ? t("game.loading.joiningRoom")
              : t("game.loading.waitingForPlayers")}
          </p>
        </div>
      </div>
    );
  }

  const isGameOver = winnerId !== null;

  const isWinner = winnerId === fullState.player_id;

  const opponentRequestedPlayAgain =
    playAgainRequestedBy !== null &&
    playAgainRequestedBy !== fullState.player_id;

  const iRequestedPlayAgain =
    playAgainRequestedBy === fullState.player_id;

  return (
    <div className="game-page game-board-container">
      <GameBoard sendAction={sendAction} />

      {!isGameOver && <DragOverlay />}

      <button
        type="button"
        className="game-leave-button"
        onClick={() => setShowLeaveConfirm(true)}
      >
        {t("game.leave.button")}
      </button>

      <ConnectionStatusOverlay status={status} />

      {isGameOver && (
        <div className="game-over-backdrop">
          <div
            className="game-over-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-over-title"
          >
            <h2 id="game-over-title">
              {isWinner ? "You won!" : "You lost!"}
            </h2>

            {timeoutMessage && (
              <p className="game-over-message">
                {timeoutMessage}
              </p>
            )}

            {opponentRequestedPlayAgain && (
              <p className="game-over-message">
                Your opponent wants to play again!
              </p>
            )}

            {iRequestedPlayAgain ? (
              <p className="game-over-message">
                Waiting for your opponent...
              </p>
            ) : (
              <button
                type="button"
                className="game-play-again-button"
                onClick={playAgain}
              >
                Play Again
              </button>
            )}

            <button
              type="button"
              className="game-leave-button"
              onClick={handleLeave}
            >
              {t("game.leave.button")}
            </button>
          </div>
        </div>
      )}

      {showLeaveConfirm && (
        <div className="leave-dialog-backdrop">
          <div
            className="leave-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-dialog-title"
          >
            <h2 id="leave-dialog-title">
              {t("game.leave.title")}
            </h2>

            <p>{t("game.leave.message")}</p>

            <div className="leave-dialog-actions">
              <button
                type="button"
                className="leave-cancel-button"
                onClick={() => setShowLeaveConfirm(false)}
              >
                {t("game.leave.cancel")}
              </button>

              <button
                type="button"
                className="leave-confirm-button"
                onClick={handleLeave}
              >
                {t("game.leave.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}