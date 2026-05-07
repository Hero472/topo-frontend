import React, { useReducer } from "react";
import { GameContext } from "./gameContextCore";
import { gameReducer } from "./GameContext";        // move the reducer here
import type { GameState } from "./gameContextCore";

const initialState: GameState = { fullState: null, winnerId: null };

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};