import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import { useRoomStore } from "../store/useRoomStore";
import { type GameSocket } from "../hooks/useGameSocket";
import "./WaitingGamePage.css";

export default function WaitingGamePage({ socket }: Readonly<{ socket: GameSocket }>) {
  useLanguage();
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const [copied, setCopied] = useState(false);

  const username = sessionStorage.getItem("game-username") ?? "";
  const players = useRoomStore((state) => state.players);
  const startingIn = useRoomStore((state) => state.startingIn);
  const notice = useRoomStore((state) => state.notice);
  const clearNotice = useRoomStore((state) => state.clearNotice);

  const inviteUrl = `${globalThis.location.origin}/game/${encodeURIComponent(gameId ?? "")}/join`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  if (!username) return null;

  if (socket.status === "error") {
    return (
      <div className="waiting-game-page">
        <div className="waiting-game-card">
          <h1 className="waiting-game-title">{t("waiting.errors.notFound")}</h1>
          <button className="waiting-game-copy-button" type="button" onClick={() => navigate("/", { replace: true })}>
            {t("waiting.errors.backHome")}
          </button>
        </div>
      </div>
    );
  }

  const isConnecting = socket.status === "connecting";
  const playerList = Object.values(players);
  const me = playerList.find((player) => player.playerId === socket.playerId);
  
  const isReady = me?.ready ?? false;
  const bothJoined = playerList.length === 2;
  const isStarting = startingIn !== null;

  return (
    <div className="waiting-game-page">
      <div className="waiting-game-card">
        <div className="waiting-game-icon" aria-hidden="true">♠</div>
        <h1 className="waiting-game-title">{isStarting ? t("waiting.starting") : t("waiting.title")}</h1>
        <p className="waiting-game-subtitle">
          {isStarting ? t("waiting.getReady") : t("waiting.subtitle")}
          <br />
          {!isStarting && t("waiting.invite")}
        </p>

        {!isStarting && (
          <div className="waiting-game-link-container">
            <input className="waiting-game-link" value={inviteUrl} readOnly aria-label="Game invite link" />
            <button className="waiting-game-copy-button" type="button" onClick={handleCopy}>
              {copied ? t("waiting.copied") : t("waiting.copy")}
            </button>
          </div>
        )}

        {notice && (
          <p className="waiting-game-notice" role="button" tabIndex={0} onClick={clearNotice} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") clearNotice(); }}>
            {notice}
          </p>
        )}

        {playerList.length > 0 && !isStarting && (
          <ul className="waiting-game-roster">
            {playerList.map((player) => (
              <li key={player.playerId} className="waiting-game-roster-item">
                <span className="waiting-game-roster-name">{player.username}</span>
                <span className={player.ready ? "waiting-game-roster-status waiting-game-roster-status--ready" : "waiting-game-roster-status"}>
                  {player.ready ? t("waiting.ready") : t("waiting.notReady")}
                </span>
              </li>
            ))}
          </ul>
        )}

        {isStarting ? (
          <div className="waiting-game-countdown">
            <span className="waiting-game-countdown-number">{startingIn}</span>
            <span className="waiting-game-countdown-label">{t("waiting.startingIn")}</span>
          </div>
        ) : bothJoined ? (
          <button className="waiting-game-ready-button" type="button" onClick={() => socket.sendAction({ type: "player_ready" })} disabled={isReady}>
            {isReady ? t("waiting.youAreReady") : t("waiting.readyButton")}
          </button>
        ) : (
          <p className="waiting-game-status">{isConnecting ? t("waiting.connecting") : t("waiting.waitingForPlayer")}</p>
        )}

        <p className="waiting-game-code">{t("waiting.gameId")} {gameId}</p>
      </div>
    </div>
  );
}