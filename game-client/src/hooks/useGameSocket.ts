import { useEffect, useRef } from "react";
import { useGameContext } from "./useGameContext";
import type { FullState, GameMessage, Action } from "../types";

export function useGameSocket(room: string, playerId: number, username: string) {
  const { dispatch } = useGameContext();
  const wsRef = useRef<WebSocket | null>(null);
  const sendActionRef = useRef<(action: Action) => void>(() => {});

  useEffect(() => {
    const url = `ws://localhost:8080/ws/${room}?player_id=${playerId}&username=${username}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ WS open");
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('Received raw:', data);
        if (data.self && data.opponent) {
          dispatch({ type: "FULL_STATE", payload: data as FullState });
        } else if (data.event) {
          dispatch({ type: "APPLY_EVENT", payload: (data as GameMessage).event });
        }
      } catch {
        console.error("Invalid WS message", e.data);
      }
    };
    ws.onerror = (err) => console.error("WS error", err);
    ws.onclose = (event) => {
      console.log("WS closed", event.code, event.reason);
    };

    sendActionRef.current = (action: Action) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(action));
      }
    };

    return () => {
      ws.close();
    };
  }, [room, playerId, username, dispatch]);

  const sendAction = (action: Action) => sendActionRef.current(action);

  return { sendAction };
}