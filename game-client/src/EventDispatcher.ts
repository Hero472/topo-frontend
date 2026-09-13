import { useGameStore } from "./store/useGameStore";
import { useRoomStore } from "./store/useRoomStore";
import type { ServerEvent } from "./types/types";


export function applyServerMessage(msg: ServerEvent) {
  if (msg.type === "full_state") {
    useGameStore.getState().applyFullState(msg);
  }
  useRoomStore.getState().applyEvent(msg);
  useGameStore.getState().applyEvent(msg);
}