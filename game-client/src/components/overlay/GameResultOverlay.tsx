import { useGameStore } from "../../store/useGameStore";
import { t, useLanguage } from "../../i18n";
import "./GameResultOverlay.css";
import { useRoomStore } from "../../store/useRoomStore";

interface GameResultOverlayProps {
  onBackToMenu: () => void;
}

export default function GameResultOverlay({
  onBackToMenu,
}: Readonly<GameResultOverlayProps>) {
  useLanguage();

  const fullState = useGameStore((s) => s.fullState);
  const winnerId = useRoomStore((s) => s.winnerId);

  if (!fullState || !winnerId) {
    return null;
  }

  const playerId = fullState.player_id;
  const isWinner = winnerId === playerId;

  return (
    <div className="game-result-overlay">
      <div className="game-result-card">
        <div
          className={`game-result-icon ${
            isWinner ? "game-result-win" : "game-result-loss"
          }`}
          aria-hidden="true"
        >
          {isWinner ? "🏆" : "♠"}
        </div>

        <h1 className="game-result-title">
          {isWinner ? t("game.result.winner") : t("game.result.loser")}
        </h1>

        <p className="game-result-subtitle">
          {isWinner
            ? t("game.result.winnerMessage")
            : t("game.result.loserMessage")}
        </p>

        <button
          className="game-result-button"
          onClick={onBackToMenu}
        >
          {t("game.result.backToMenu")}
        </button>
      </div>
    </div>
  );
}