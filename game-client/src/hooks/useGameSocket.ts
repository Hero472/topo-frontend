import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Action } from "../types/types";
import { useGameStore } from "../store/useGameStore";

type ConnectionStatus =
  | "connecting"
  | "open"
  | "closed"
  | "reconnecting"
  | "error";

function getPlayerId(): string {
  const key = "game-player-id";

  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function useGameSocket(gameId: string, username: string) {
  const applyFullState = useGameStore((s) => s.applyFullState);
  const applyEvent = useGameStore((s) => s.applyEvent);

  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);

  const isUnmounted = useRef(false);
  const closedIntentionally = useRef(false);

  const playerId = useMemo(() => getPlayerId(), []);

  const sendAction = useCallback((action: Action) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(action));
    } else {
      console.warn("📤 Cannot send action – socket not open");
    }
  }, []);

  const leaveGame = useCallback(() => {
    closedIntentionally.current = true;

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Player left game");
      wsRef.current = null;
    }

    setStatus("closed");
  }, []);

  useEffect(() => {
    isUnmounted.current = false;

    let cancelled = false;

    function connect() {
      if (cancelled || isUnmounted.current) {
        return;
      }

      closedIntentionally.current = false;

      const protocol = globalThis.location.protocol === "https:" ? "wss" : "ws";

      const url =
        `${protocol}://${globalThis.location.host}` +
        `/ws/${encodeURIComponent(gameId)}` +
        `?player_id=${encodeURIComponent(playerId)}` +
        `&username=${encodeURIComponent(username)}`;

      console.log(
        `🔌 Connecting to ${url} ` + `(attempt ${attemptRef.current + 1})`,
      );

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) {
          ws.close();
          return;
        }

        console.log("✅ WebSocket connected");

        setStatus("open");
        setError(null);

        attemptRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          console.log("📩 Received:", data);

          if (data.type === "full_state") {
            applyFullState(data);
          } else {
            applyEvent(data);
          }
        } catch (e) {
          console.error("❌ Failed to process message:", event.data, e);
        }
      };

      ws.onerror = (err) => {
        console.error("⚠️ WebSocket error:", err);
        setError("WebSocket error");
        setStatus("error");
      };

      ws.onclose = (event) => {
        if (cancelled || isUnmounted.current) {
          return;
        }

        console.log(`🔻 WebSocket closed (code ${event.code})`);

        if (closedIntentionally.current) {
          console.log("Closed intentionally – not reconnecting");

          setStatus("closed");
          return;
        }

        setStatus("reconnecting");
        const delay = Math.min(1000 * 2 ** attemptRef.current, 30000);
        attemptRef.current++;

        console.log(`🔄 Reconnecting in ${delay / 1000}s...`);
        reconnectTimer.current = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      cancelled = true;
      isUnmounted.current = true;
      closedIntentionally.current = true;

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }

      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
      }
    };
  }, [gameId, username, playerId, applyFullState, applyEvent]);

  return {
    sendAction,
    leaveGame,
    status,
    error,
  };
}
