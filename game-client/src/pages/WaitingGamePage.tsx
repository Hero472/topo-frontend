import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGameSocket } from "../hooks/useGameSocket";
import { useGameStore } from "../store/useGameStore";
import { t, useLanguage } from "../i18n";

import "./WaitingGamePage.css";

export default function WaitingGamePage() {
  useLanguage();

  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const username = sessionStorage.getItem("game-username") ?? "";

  // If no username set yet, this player never went through the join flow — send them there.
  useEffect(() => {
    if (!username && gameId) {
      navigate(`/game/${encodeURIComponent(gameId)}/join`, { replace: true });
    }
  }, [username, gameId, navigate]);

  const { status } = useGameSocket(gameId ?? "", username);

  const fullState = useGameStore((s) => s.fullState);

  // Invite link points at the JOIN page, not this waiting page.
  const inviteUrl = `${globalThis.location.origin}/game/${encodeURIComponent(gameId ?? "")}/join`;

  useEffect(() => {
    if (fullState) {
      navigate(`/game/${encodeURIComponent(gameId ?? "")}`, { replace: true });
    }
  }, [fullState, gameId, navigate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  if (!username) return null; // avoid a flash before the redirect effect runs

  const isConnecting = status === "connecting";

  return (
    <div className="waiting-game-page">
      <div className="waiting-game-card">
        <div className="waiting-game-icon" aria-hidden="true">
          ♠
        </div>
        <h1 className="waiting-game-title">{t("waiting.title")}</h1>
        <p className="waiting-game-subtitle">
          {t("waiting.subtitle")}
          <br />
          {t("waiting.invite")}
        </p>

        <div className="waiting-game-link-container">
          <input
            className="waiting-game-link"
            value={inviteUrl}
            readOnly
            aria-label="Game invite link"
          />
          <button
            className="waiting-game-copy-button"
            onClick={() => void handleCopy()}
          >
            {copied ? t("waiting.copied") : t("waiting.copy")}
          </button>
        </div>

        <p className="waiting-game-status">
          {isConnecting
            ? t("waiting.connecting")
            : t("waiting.waitingForPlayer")}
        </p>
        <p className="waiting-game-code">{t("waiting.gameId")} {gameId}</p>
      </div>
    </div>
  );
}
