import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameSocket } from "../hooks/useGameSocket";
import { t, useLanguage } from "../i18n";
import { useRoomStore } from "../store/useRoomStore";
import "./WaitingGamePage.css";

export default function WaitingGamePage() {
  useLanguage();

  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const username = sessionStorage.getItem("game-username") ?? "";

  useEffect(() => {
    if (!username && gameId) {
      navigate(
        `/game/${encodeURIComponent(gameId)}/join`,
        { replace: true },
      );
    }
  }, [username, gameId, navigate]);

  const { status, sendCommand } = useGameSocket(
    gameId ?? "",
    username,
  );

  const phase = useRoomStore((state) => state.phase);
  const players = useRoomStore((state) => state.players);
  const startingIn = useRoomStore((state) => state.startingIn);
  const notice = useRoomStore((state) => state.notice);
  const clearNotice = useRoomStore((state) => state.clearNotice);

  const inviteUrl =
    `${globalThis.location.origin}/game/` +
    `${encodeURIComponent(gameId ?? "")}/join`;

  useEffect(() => {
    if (phase === "playing") {
      navigate(
        `/game/${encodeURIComponent(gameId ?? "")}`,
        { replace: true },
      );
    }
  }, [phase, gameId, navigate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  const handleReady = () => {
    sendCommand({
      type: "player_ready",
    });
  };

  if (!username) {
    return null;
  }

  if (status === "error") {
    return (
      <div className="waiting-game-page">
        <div className="waiting-game-card">
          <h1 className="waiting-game-title">
            {t("waiting.errors.notFound")}
          </h1>

          <button
            className="waiting-game-copy-button"
            type="button"
            onClick={() => navigate("/")}
          >
            {t("waiting.errors.backHome")}
          </button>
        </div>
      </div>
    );
  }

  const isConnecting = status === "connecting";
  const playerList = Object.values(players);

  const me = playerList.find(
    (player) => player.username === username,
  );

  const isReady = me?.ready ?? false;
  const bothJoined = playerList.length === 2;

  return (
    <div className="waiting-game-page">
      <div className="waiting-game-card">
        <div className="waiting-game-icon" aria-hidden="true">
          ♠
        </div>

        <h1 className="waiting-game-title">
          {phase === "starting"
            ? t("waiting.starting")
            : t("waiting.title")}
        </h1>

        <p className="waiting-game-subtitle">
          {phase === "starting"
            ? t("waiting.getReady")
            : t("waiting.subtitle")}
          <br />
          {phase !== "starting" && t("waiting.invite")}
        </p>

        {phase !== "starting" && (
          <div className="waiting-game-link-container">
            <input
              className="waiting-game-link"
              value={inviteUrl}
              readOnly
              aria-label="Game invite link"
            />

            <button
              className="waiting-game-copy-button"
              type="button"
              onClick={() => void handleCopy()}
            >
              {copied
                ? t("waiting.copied")
                : t("waiting.copy")}
            </button>
          </div>
        )}

        {notice && (
          <p
            className="waiting-game-notice"
            role="button"
            tabIndex={0}
            onClick={clearNotice}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                clearNotice();
              }
            }}
          >
            {notice}
          </p>
        )}

        {playerList.length > 0 && phase !== "starting" && (
          <ul className="waiting-game-roster">
            {playerList.map((player) => (
              <li
                key={player.playerId}
                className="waiting-game-roster-item"
              >
                <span className="waiting-game-roster-name">
                  {player.username}
                </span>

                <span
                  className={
                    player.ready
                      ? "waiting-game-roster-status waiting-game-roster-status--ready"
                      : "waiting-game-roster-status"
                  }
                >
                  {player.ready
                    ? t("waiting.ready")
                    : t("waiting.notReady")}
                </span>
              </li>
            ))}
          </ul>
        )}

        {phase === "starting" && startingIn != null ? (
          <div className="waiting-game-countdown">
            <span className="waiting-game-countdown-number">
              {startingIn}
            </span>

            <span className="waiting-game-countdown-label">
              {t("waiting.startingIn")}
            </span>
          </div>
        ) : bothJoined ? (
          <button
            className="waiting-game-ready-button"
            type="button"
            onClick={handleReady}
            disabled={isReady}
          >
            {isReady
              ? t("waiting.youAreReady")
              : t("waiting.readyButton")}
          </button>
        ) : (
          <p className="waiting-game-status">
            {isConnecting
              ? t("waiting.connecting")
              : t("waiting.waitingForPlayer")}
          </p>
        )}

        <p className="waiting-game-code">
          {t("waiting.gameId")} {gameId}
        </p>
      </div>
    </div>
  );
}