import React, { createContext, useContext, useReducer, type Dispatch } from "react";
import type { FullState, ServerEvent } from "../types";

interface GameState {
  fullState: FullState | null;
  turnSeconds: number;
  winnerId: number | null;
}

type Action =
  | { type: "FULL_STATE"; payload: FullState }
  | { type: "APPLY_EVENT"; payload: ServerEvent };

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "FULL_STATE":
      return { ...state, fullState: action.payload, winnerId: null };
    case "APPLY_EVENT": {
      if (!state.fullState) return state;
      const s = { ...state.fullState }; // shallow clone, we'll mutate carefully
      const event = action.payload;
      switch (event.type) {
        case "CardDrawn":
          if (s.self.player_idx === event.player_id) {
            s.self.hand.push(event.card);
          }
          break;
        case "CardPlayedOnScale": {
          // remove from hand (we don't know index, but simplest: pop last if match?);
          // better: later we will update hand via OpponentUpdate or explicit removal.
          // For now just update scales placeholder.
          break;
        }
        case "OpponentUpdate": {
          s.opponent = {
            ...s.opponent,
            personal_count: event.personal_count,
            personal_top: event.personal_top,
            side: event.side,
          };
          break;
        }
        case "TurnEnded":
          s.current_turn = event.next_player_id;
          break;
        case "GameStarted":
          s.current_turn = event.current_player_id;
          break;
        case "GameOver":
          return { ...state, winnerId: event.winner_id };
        default:
          break;
      }
      return { ...state, fullState: s };
    }
    default:
      return state;
  }
}

interface IGameContext {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const GameContext = createContext<IGameContext | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    fullState: null,
    turnSeconds: 60,
    winnerId: null,
  });
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used inside GameProvider");
  return ctx;
};