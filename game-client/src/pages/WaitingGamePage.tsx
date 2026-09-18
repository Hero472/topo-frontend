import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import { useRoomStore } from "../store/useRoomStore";
import { useGameStore } from "../store/useGameStore"; // <-- Added for complete cleanup
import { type GameSocket } from "../hooks/useGameSocket";
import { gameApi } from "../api/GameApi";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Modal } from "../components/common/Modal";
import tutorialVideo from "../assets/drag_drop_tutorial.mp4";
import "./WaitingGamePage.css";

export default function WaitingGamePage({ socket }: Readonly<{ socket: GameSocket }>) {
  useLanguage();
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  // ✅ 1. ALL HOOKS MUST BE AT THE VERY TOP, BEFORE ANY EARLY RETURNS
  const [isValidating, setIsValidating] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const username = sessionStorage.getItem("game-username") ?? "";
  const myPlayerId = useRoomStore((state) => state.myPlayerId) ?? socket.playerId;
  
  const players = useRoomStore((state) => state.players);
  const startingIn = useRoomStore((state) => state.startingIn);
  const notice = useRoomStore((state) => state.notice);
  const clearNotice = useRoomStore((state) => state.clearNotice);

  const inviteUrl = `${globalThis.location.origin}/game/${gameId ?? ""}/join`;
  const tutorialStorageKey = gameId ? `game-tutorial-seen-${gameId}` : "game-tutorial-seen";

  // ✅ 2. Pre-flight check
  useEffect(() => {
    const validateGame = async () => {
      if (!gameId) {
        navigate("/join", { replace: true });
        return;
      }

      const exists = await gameApi.checkGameExists(gameId);

      if (!exists) {
        navigate("/join", { 
          replace: true,
          state: { error: t("waiting.errors.notFound") } 
        });
      } else {
        setIsValidating(false);
      }
    };

    validateGame();
  }, [gameId, navigate]);

  // ✅ 3. EARLY RETURNS MUST COME *AFTER* ALL HOOKS
  if (!username) return null;

  if (isValidating) {
    return (
      <div className="waiting-game-page">
        <Card variant="elevated" className="waiting-game-card">
          <h1 className="waiting-game-title">{t("waiting.validating") || "Validating game..."}</h1>
        </Card>
      </div>
    );
  }

  if (socket.status === "error") {
    return (
      <div className="waiting-game-page">
        <Card variant="elevated" className="waiting-game-card">
          <h1 className="waiting-game-title">{t("waiting.errors.notFound")}</h1>
          <Button variant="secondary" onClick={() => navigate("/join", { replace: true })}>
            {t("waiting.errors.backToJoin") || "Back to Join"}
          </Button>
        </Card>
      </div>
    );
  }

  // ✅ 4. Event handlers
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  // ✅ 5. NEW: Handle leaving the game cleanly
  const handleLeave = () => {
    // Reset stores to clear any lingering game state
    useRoomStore.getState().reset();
    if (useGameStore) useGameStore.getState().reset();
    
    // Tell the backend we are leaving the room
    socket.leaveGame();
    
    // Navigate back to the main menu (change "/" to "/join" if that's your main menu route)
    navigate("/", { replace: true });
  };

  const handleReadyClick = () => {
    const alreadySeen = sessionStorage.getItem(tutorialStorageKey) === "1";
    if (alreadySeen) {
      socket.sendAction({ type: "player_ready" });
      return;
    }
    setShowTutorial(true);
  };

  const handleTutorialConfirm = () => {
    sessionStorage.setItem(tutorialStorageKey, "1");
    setShowTutorial(false);
    socket.sendAction({ type: "player_ready" });
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };

  // ✅ 6. Render logic
  const isConnecting = socket.status === "connecting";
  const playerList = Object.values(players);
  const me = playerList.find((player) => player.playerId === myPlayerId);

  const isReady = me?.ready ?? false;
  const bothJoined = playerList.length === 2;
  const isStarting = startingIn !== null;

  return (
    <div className="waiting-game-page">
      <Card variant="elevated" className="waiting-game-card">
        <div className="waiting-game-icon" aria-hidden="true">♠</div>
        <h1 className="waiting-game-title">{isStarting ? t("waiting.starting") : t("waiting.title")}</h1>
        <p className="waiting-game-subtitle">
          {isStarting ? t("waiting.getReady") : t("waiting.subtitle")}
          <br />
          {!isStarting && t("waiting.invite")}
        </p>

        {!isStarting && (
          <div className="waiting-game-link-container">
            <Input
              value={inviteUrl}
              readOnly
              aria-label="Game invite link"
              className="waiting-game-input"
            />
            <Button variant="primary" onClick={handleCopy}>
              {copied ? t("waiting.copied") : t("waiting.copy")}
            </Button>
          </div>
        )}

        {notice && (
          <Card variant="outlined" clickable onClick={clearNotice} className="waiting-game-notice">
            {notice}
          </Card>
        )}

        {playerList.length > 0 && !isStarting && (
          <ul className="waiting-game-roster">
            {playerList.map((player) => (
              <li key={player.playerId} className="waiting-game-roster-item">
                <span className="waiting-game-roster-name">{player.username}</span>
                <span className={`waiting-game-roster-status ${player.ready ? "waiting-game-roster-status--ready" : ""}`}>
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
          <Button
            variant={isReady ? "secondary" : "primary"}
            fullWidth
            onClick={handleReadyClick}
            disabled={isReady}
            className={isReady ? "waiting-game-ready-button--ready" : ""}
          >
            {isReady ? t("waiting.youAreReady") : t("waiting.readyButton")}
          </Button>
        ) : (
          <p className="waiting-game-status">
            {isConnecting ? t("waiting.connecting") : t("waiting.waitingForPlayer")}
          </p>
        )}

        {/* ✅ 7. NEW: Leave Button placed cleanly at the bottom */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <p className="waiting-game-code">{t("waiting.gameId")} {gameId}</p>
          <Button 
            variant="secondary" 
            onClick={handleLeave}
            style={{ marginTop: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }} // Optional: style as a "danger/leave" action
          >
            {t("waiting.leaveGame") || "Leave Game"}
          </Button>
        </div>
      </Card>

      <Modal
        open={showTutorial}
        title={t("waiting.tutorial.title")}
        onClose={handleTutorialClose}
        footer={
          <Button variant="primary" onClick={handleTutorialConfirm}>
            {t("waiting.tutorial.confirm")}
          </Button>
        }
      >
        <p className="waiting-tutorial-text">{t("waiting.tutorial.description")}</p>
        <div className="waiting-tutorial-media">
          <video
            src={tutorialVideo}
            autoPlay
            loop
            muted
            playsInline
            className="waiting-tutorial-video"
          />
        </div>
      </Modal>
    </div>
  );
}