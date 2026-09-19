import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Action } from "../types/types";
import { applyServerMessage } from "../EventDispatcher";

export type ConnectionStatus = "connecting" | "open" | "closed" | "reconnecting" | "error";

export interface GameSocket {
  sendAction: (action: Action) => void;
  leaveGame: () => void;
  status: ConnectionStatus;
  error: string | null;
  playerId: string;
}

function getPlayerId(): string {
  const key = "game-player-id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function useGameSocket(gameId: string, username: string): GameSocket {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);

  const isUnmounted = useRef(false);
  const closedIntentionally = useRef(false);
  const playerId = useMemo(() => getPlayerId(), []);

  // 🚀 PRODUCTION READY: Dynamically resolve the WebSocket base URL
  const wsBaseUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL || "";
    
    if (envUrl) {
      return envUrl.replace(/^http/, "ws");
    }
    return "";
  }, []);

  const sendAction = useCallback((action: Action) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(action));
    } else {
      console.warn("📤 Cannot send action – socket not open");
    }
  }, []);

  const leaveGame = useCallback(() => {
    closedIntentionally.current = true;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "leave" }));
    }

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
      if (cancelled || isUnmounted.current) return;
      closedIntentionally.current = false;

      // 🚀 PRODUCTION READY: Clean URL construction using the resolved base URL
      const url = `${wsBaseUrl}/ws/${encodeURIComponent(gameId)}?player_id=${encodeURIComponent(playerId)}&username=${encodeURIComponent(username)}`;

      console.log(`Connecting to ${url || window.location.origin + "/ws/..."} (attempt ${attemptRef.current + 1})`);

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
          applyServerMessage(data);
        } catch (e) {
          console.error("❌ Failed to process message:", event.data, e);
        }
      };

      ws.onerror = (event) => {
        console.error("❌ WebSocket error:", event);
        setError("WebSocket connection error");
        setStatus("error");
      };

      ws.onclose = (event) => {
        if (cancelled || isUnmounted.current) return;

        if (closedIntentionally.current) {
          setStatus("closed");
          return;
        }

        console.warn(`⚠️ WebSocket closed (Code: ${event.code}). Reconnecting...`);
        setStatus("reconnecting");
        
        // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
        const delay = Math.min(1000 * 2 ** attemptRef.current, 30000);
        attemptRef.current++;
        
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
        reconnectTimer.current = null;
      }
      
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
    };
  }, [gameId, username, playerId, wsBaseUrl]);

  return { sendAction, leaveGame, status, error, playerId };
}