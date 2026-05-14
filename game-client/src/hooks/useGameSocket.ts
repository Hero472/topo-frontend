import { useCallback, useEffect, useRef, useState } from "react";
import type { Action } from "../types";
import { useGameStore } from "../store/useGameStore";

type ConnectionStatus = "connecting" | "open" | "closed" | "error";

export function useGameSocket(room: string, playerId: number, username: string) {
  const applyFullState = useGameStore((s) => s.applyFullState);
  const applyEvent = useGameStore((s) => s.applyEvent);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(0);
  const attemptRef = useRef(0);
  const isUnmounted = useRef(false);

  const sendAction = useCallback((action: Action) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(action));
    } else {
      console.warn('📤 Cannot send action – socket not open');
    }
  }, []);

  useEffect(() => {
    isUnmounted.current = false;
    let cancelled = false;

    function connect() {
      if (cancelled || isUnmounted.current) return;

      const url = `ws://localhost:8080/ws/${room}?player_id=${playerId}&username=${encodeURIComponent(username)}`;
      console.log(`🔌 Connecting to ${url} (attempt ${attemptRef.current + 1})`);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) { ws.close(); return; }
        console.log('✅ WebSocket connected');
        setStatus('open');
        setError(null);
        attemptRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📩 Received:', data);
          if (data?.type === 'full_state') {
            applyFullState(data);
          } else {
            applyEvent(data);
          }
        } catch (e) {
          console.error('❌ Failed to parse message:', event.data, e);
        }
      };

      ws.onerror = (err) => {
        console.error('⚠️ WebSocket error:', err);
        setError('WebSocket error');
      };

      ws.onclose = (event) => {
        if (cancelled || isUnmounted.current) return;
        console.log(`🔻 WebSocket closed (code ${event.code})`);
        setStatus('closed');
        if (event.code !== 1000) {
          const delay = Math.min(1000 * 2 ** attemptRef.current, 30000);
          attemptRef.current++;
          console.log(`🔄 Reconnecting in ${delay / 1000}s...`);
          reconnectTimer.current = setTimeout(connect, delay);
        } else {
          console.log('👋 Clean close – not reconnecting');
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      isUnmounted.current = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close(1000, 'Component unmounted');
    };
  }, [room, playerId, username, applyFullState, applyEvent]);

  return { sendAction, status, error };
}