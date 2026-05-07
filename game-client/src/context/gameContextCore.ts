import { createContext, type Dispatch } from "react";
import type { FullState, ServerEvent } from "../types";

// ── State shape ──
export interface GameState {
  fullState: FullState | null;
  winnerId: number | null;
}

// ── Actions ──
export type Action =
  | { type: "FULL_STATE"; payload: FullState }
  | { type: "APPLY_EVENT"; payload: ServerEvent };

// ── Context type ──
export interface IGameContext {
  state: GameState;
  dispatch: Dispatch<Action>;
}

export const GameContext = createContext<IGameContext | undefined>(undefined);