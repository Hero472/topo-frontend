import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";
import { useRoomStore } from "../store/useRoomStore";
import { type GameSocket } from "../hooks/useGameSocket";

import GameBoard from "../components/game/GameBoard";
import DragOverlay from "../components/overlay/DragOverlay";
import ConnectionStatusOverlay from "../components/overlay/ConnectionStatusOverlay";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { t, useLanguage } from "../i18n";

export default function GamePage({ socket }: Readonly<{ socket: GameSocket }>) {
  useLanguage();
  const navigate = useNavigate();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const fullState = useGameStore((s) => s.fullState);
  const turnTimeoutMessage = useGameStore((s) => s.turnTimeoutMessage);

  const phase = useRoomStore((s) => s.phase);
  const winnerId = useRoomStore((s) => s.winnerId);
  const reason = useRoomStore((s) => s.reason);
  const playAgainRequestedBy = useRoomStore((s) => s.playAgainRequestedBy);
  const disconnected = useRoomStore((s) => s.disconnected);

  const handleLeave = () => {
    useRoomStore.getState().reset();
    useGameStore.getState().reset();
    socket.leaveGame();
    navigate("/", { replace: true });
  };

  const handleCreateNew = () => {
    useRoomStore.getState().reset();
    useGameStore.getState().reset();
    socket.leaveGame();
    navigate("/join", { replace: true });
  };

  // --- Loading State ---
  if (!fullState) {
    const isConnecting = socket.status === "connecting" || socket.status === "reconnecting";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 animate-pulse">
          <div className="text-6xl" aria-hidden="true">{isConnecting ? "🃏" : "♠"}</div>
          <h1 className="text-2xl font-bold text-foreground-primary">
            {isConnecting ? t("game.loading.connecting") : t("game.loading.waiting")}
          </h1>
          <p className="text-foreground-tertiary">
            {isConnecting ? t("game.loading.joiningRoom") : t("game.loading.waitingForPlayers")}
          </p>
        </div>
      </div>
    );
  }

  // --- Game State Logic ---
  const isGameOver = phase === "game_over" && winnerId !== null;
  const isWinner = winnerId === fullState.player_id;
  const opponentRequestedPlayAgain = playAgainRequestedBy.size > 0 && !playAgainRequestedBy.has(fullState.player_id);
  const iRequestedPlayAgain = playAgainRequestedBy.has(fullState.player_id);

  const isOpponentGone = 
    reason === "player_leave" ||
    reason === "Opponent left the game" || 
    reason === "Opponent disconnected" ||
    reason === "Player left the game" ||
    (reason?.toLowerCase().includes("left") ?? false);

  const isCurrentPlayerReconnecting = 
    socket.status === "reconnecting" || 
    (socket.status === "connecting" && disconnected !== null && disconnected.playerId === fullState.player_id);

  const isOpponentReconnecting = 
    disconnected !== null && disconnected.playerId !== fullState.player_id;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      <GameBoard sendAction={socket.sendAction} />
      {!isGameOver && <DragOverlay />}

      {/* Opponent Reconnect Banner (Floating Pill) */}
      {isOpponentReconnecting && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-state-warning-bg text-state-warning border border-state-warning/30 shadow-md animate-pulse">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-medium">{t("game.reconnecting.opponent")}</span>
        </div>
      )}

      {/* Leave Button (Floating Top Right) */}
      <Button 
        variant="ghost" 
        size="sm"
        className="fixed top-20 right-4 z-30"
        onClick={() => setShowLeaveConfirm(true)}
      >
        {t("game.leave.button")}
      </Button>

      <ConnectionStatusOverlay status={socket.status} />

      {/* GAME OVER MODAL */}
      {isGameOver && (
        <Modal
          open={isGameOver}
          title={isWinner ? t("game.over.youWon") : t("game.over.youLost")}
          onClose={handleLeave} // Clicking X leaves the game
          footer={
            <div className="flex flex-col w-full gap-2">
              {!isOpponentGone && (
                iRequestedPlayAgain ? (
                  <p className="text-center text-sm text-foreground-tertiary py-2">{t("game.over.waitingForOpponent")}</p>
                ) : (
                  <Button variant="primary" fullWidth onClick={() => socket.sendAction({ type: "play_again" })}>
                    {t("game.over.playAgain")}
                  </Button>
                )
              )}
              <Button variant="secondary" fullWidth onClick={handleCreateNew}>
                {t("game.over.createNewGame") || "Create New Game"}
              </Button>
              <Button variant="ghost" fullWidth onClick={handleLeave} className="text-state-error hover:bg-state-error/10">
                {t("game.leave.button")}
              </Button>
            </div>
          }
        >
          <div className="space-y-2 text-center">
            {reason && <p className="text-foreground-secondary">{reason}</p>}
            {turnTimeoutMessage && <p className="text-foreground-secondary">{turnTimeoutMessage}</p>}
            {!isOpponentGone && opponentRequestedPlayAgain && (
              <p className="text-brand-primary font-medium">{t("game.over.opponentWantsRematch")}</p>
            )}
          </div>
        </Modal>
      )}

      {/* LEAVE CONFIRMATION MODAL */}
      <Modal
        open={showLeaveConfirm}
        title={t("game.leave.title")}
        onClose={() => setShowLeaveConfirm(false)}
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="secondary" fullWidth onClick={() => setShowLeaveConfirm(false)}>
              {t("game.leave.cancel")}
            </Button>
            <Button variant="danger" fullWidth onClick={handleLeave}>
              {t("game.leave.confirm")}
            </Button>
          </div>
        }
      >
        <p className="text-foreground-secondary text-center">
          {t("game.leave.message")}
        </p>
      </Modal>

      {/* CURRENT PLAYER RECONNECTING MODAL */}
      {isCurrentPlayerReconnecting && (
        <Modal
          open={isCurrentPlayerReconnecting}
          title={t("game.reconnecting.title")}
          // Omitting onClose hides the X button, preventing them from closing it manually
        >
          <div className="flex flex-col items-center gap-4 py-4">
            <svg className="w-12 h-12 text-brand-primary animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
            <p className="text-foreground-secondary text-center">{t("game.reconnecting.message")}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}