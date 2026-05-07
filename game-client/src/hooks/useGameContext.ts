import { useContext } from "react";
import { GameContext } from "../context/gameContextCore";

export const useGameContext = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used within GameProvider");
  return ctx;
};