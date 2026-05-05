import { useEffect, useRef } from "react";
import { useGameContext } from "../context/GameContext";
import type { FullState, GameMessage } from "../types";

export function useGameSocket(room: string, playerId: number, username: string) {
  const { dispatch } = useGameContext();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = `ws://localhost:8080/ws/${room}?player_id=${playerId}&username=${username}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.self && data.opponent) {
          // It's a FullState
          dispatch({ type: "FULL_STATE", payload: data as FullState });
        } else if (data.event) {
          // It's a GameMessage
          dispatch({ type: "APPLY_EVENT", payload: (data as GameMessage).event });
        }
      } catch (err) {
        console.error("Invalid message", e.data);
      }
    };

    ws.onerror = (err) => console.error("WS error", err);
    ws.onclose = (event) => {
    console.log('🔌 WS closed', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
    });
    };

    return () => ws.close();
  }, [room, playerId, username, dispatch]);

  const sendAction = (action: any) => {
    wsRef.current?.send(JSON.stringify(action));
  };

  return { sendAction };
}