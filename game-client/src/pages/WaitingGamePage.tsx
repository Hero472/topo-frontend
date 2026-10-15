import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { t, useLanguage } from "../i18n";
import { useRoomStore } from "../store/useRoomStore";
import { useGameStore } from "../store/useGameStore";
import { type GameSocket } from "../hooks/useGameSocket";
import { gameApi } from "../api/GameApi";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import tutorialVideo from "../assets/drag_drop_tutorial.mp4";

export default function WaitingGamePage({ socket }: Readonly<{ socket: GameSocket }>) {
  useLanguage();
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

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

  // ✅ FIX 1: Added retry logic for eventual consistency / network lag
  useEffect(() => {
    let isMounted = true;

    const validateGame = async () => {
      if (!gameId) {
        if (isMounted) navigate("/join", { replace: true });
        return;
      }

      let attempts = 0;
      const maxAttempts = 3;
      let exists = false;

      while (attempts < maxAttempts) {
        try {
          exists = await gameApi.checkGameExists(gameId);
          if (exists) break;
        } catch (error) {
          console.warn(`Validation attempt ${attempts + 1} failed:`, error);
        }
        
        attempts++;
        
        if (!exists && attempts < maxAttempts && isMounted) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      if (!isMounted) return;

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

    return () => {
      isMounted = false;
    };
  }, [gameId, navigate]);

  // ✅ FIX 2: Prevent "render-phase navigation" anti-pattern.
  useEffect(() => {
    if (!username && !isValidating) {
      navigate("/join", { replace: true });
    }
  }, [username, isValidating, navigate]);

  // Show loading state while validating OR if username is missing
  if (isValidating || !username) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto py-12 px-4 flex flex-col items-center justify-center">
        <Card variant="elevated" padding="lg" className="w-full text-center">
          <div className="animate-pulse text-foreground-tertiary font-medium">
            {t("waiting.validating") || "Validating game..."}
          </div>
        </Card>
      </div>
    );
  }

  if (socket.status === "error") {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto py-12 px-4 flex flex-col items-center justify-center">
        <Card variant="elevated" padding="lg" className="w-full text-center space-y-4">
          <h1 className="text-xl font-bold text-state-error">{t("waiting.errors.notFound")}</h1>
          <Button variant="secondary" onClick={() => navigate("/join", { replace: true })}>
            {t("waiting.errors.backToJoin") || "Back to Join"}
          </Button>
        </Card>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  const handleLeave = () => {
    useRoomStore.getState().reset();
    if (useGameStore) useGameStore.getState().reset();
    socket.leaveGame();
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

  const isConnecting = socket.status === "connecting";
  const playerList = Object.values(players);
  const me = playerList.find((player) => player.playerId === myPlayerId);

  const isReady = me?.ready ?? false;
  const bothJoined = playerList.length === 2;
  const isStarting = startingIn !== null;

  return (
    <div className="min-h-screen w-full max-w-lg mx-auto py-8 px-4 flex flex-col items-center justify-center">
      <Card variant="elevated" padding="lg" className="w-full">
        
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-5xl text-brand-primary mb-3 block" aria-hidden="true">♠</span>
          <h1 className="text-2xl font-bold text-foreground-primary tracking-tight">
            {isStarting ? t("waiting.starting") : t("waiting.title")}
          </h1>
          <p className="text-sm text-foreground-tertiary mt-2 leading-relaxed">
            {isStarting ? t("waiting.getReady") : t("waiting.subtitle")}
            {!isStarting && <><br />{t("waiting.invite")}</>}
          </p>
        </div>

        {/* Invite Link */}
        {!isStarting && (
          <div className="flex gap-2 mt-4">
            <Input
              value={inviteUrl}
              readOnly
              aria-label="Game invite link"
              className="flex-1 font-mono text-sm"
            />
            <Button variant="primary" onClick={handleCopy} className="shrink-0">
              {copied ? t("waiting.copied") : t("waiting.copy")}
            </Button>
          </div>
        )}

        {/* Notice */}
        {notice && (
          <Card 
            variant="outlined" 
            clickable 
            onClick={clearNotice} 
            className="mt-4 cursor-pointer hover:bg-background-tertiary transition-colors text-center text-sm text-foreground-secondary"
          >
            {notice}
          </Card>
        )}

        {/* Player Roster */}
        {playerList.length > 0 && !isStarting && (
          <ul className="mt-6 space-y-2">
            {playerList.map((player) => (
              <li 
                key={player.playerId} 
                className="flex items-center justify-between p-3 rounded-md bg-background-tertiary border border-border-primary"
              >
                <span className="font-medium text-foreground-primary truncate pr-2">
                  {player.username}
                </span>
                <span className={`text-sm font-medium shrink-0 ${player.ready ? "text-state-success" : "text-foreground-tertiary"}`}>
                  {player.ready ? t("waiting.ready") : t("waiting.notReady")}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Action Area: Countdown, Ready Button, or Waiting Status */}
        {isStarting ? (
          <div className="mt-8 text-center">
            <span className="text-5xl font-bold text-brand-primary block animate-pulse">
              {startingIn}
            </span>
            <span className="text-sm font-medium text-foreground-tertiary uppercase tracking-wider mt-2 block">
              {t("waiting.startingIn")}
            </span>
          </div>
        ) : bothJoined ? (
          <Button
            variant={isReady ? "secondary" : "primary"}
            fullWidth
            size="lg"
            onClick={handleReadyClick}
            disabled={isReady}
            className="mt-6"
          >
            {isReady ? t("waiting.youAreReady") : t("waiting.readyButton")}
          </Button>
        ) : (
          <p className="mt-6 text-center text-foreground-tertiary italic">
            {isConnecting ? t("waiting.connecting") : t("waiting.waitingForPlayer")}
          </p>
        )}

        {/* Footer: Game ID & Leave Button */}
        <div className="mt-8 pt-6 border-t border-border-primary flex flex-col items-center gap-3">
          <p className="text-xs font-mono text-foreground-quaternary">
            {t("waiting.gameId")}: <span className="text-foreground-tertiary">{gameId}</span>
          </p>
          <Button 
            variant="ghost" 
            onClick={handleLeave}
            className="text-state-error hover:bg-state-error/10 hover:text-state-error"
          >
            {t("waiting.leaveGame") || "Leave Game"}
          </Button>
        </div>

      </Card>

      {/* Tutorial Modal */}
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
        <p className="text-foreground-secondary leading-relaxed mb-4">
          {t("waiting.tutorial.description")}
        </p>
        <div className="rounded-lg overflow-hidden border border-border-primary bg-background-tertiary">
          <video
            src={tutorialVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full aspect-video object-cover"
          />
        </div>
      </Modal>
    </div>
  );
}