import PlayerBoard from "./PlayerBoard";
import CenterArea from "./CenterArea";
import type { Card } from "../types/types";

interface PlayerData {
  hand: Card[];
  drawPile: Card[];
  personalStacks: Card[][];
  rightStack: Card[];
}

interface Props {
  currentPlayer: PlayerData;
  opponent: PlayerData;
  commonStacks: Card[][];
  onCardDrop: (card: Card, sourceStackId: string, targetStackId: string) => void;
}

export default function GameBoard({
  currentPlayer,
  opponent,
  commonStacks,
  onCardDrop,
}: Readonly<Props>) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "1fr auto 1fr",
        height: "100vh",
        padding: "14px",
        gap: "14px",
        boxSizing: "border-box",
        background:
          "radial-gradient(ellipse at center, #1b4d1b 0%, #0a2e0a 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Opponent – takes 1fr (large area) */}
      <div
        style={{
          overflow: "auto",
          padding: "8px 10px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "10px",
          backdropFilter: "blur(6px)",
          minHeight: 0, // allows scrolling when content overflows
        }}
      >
        <PlayerBoard
          playerId="opponent"
          rotated
          hand={opponent.hand}
          personalStacks={opponent.personalStacks}
          rightStack={opponent.rightStack}
          onCardDrop={onCardDrop}
        />
      </div>

      {/* Center – only as tall as its content (auto) */}
      <div
        style={{
          background: "rgba(0,0,0,0.25)",
          borderRadius: "14px",
          padding: "12px",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(4px)",
        }}
      >
        <CenterArea stacks={commonStacks} onCardDrop={onCardDrop} />
      </div>

      {/* Current player – takes 1fr (large area) */}
      <div
        style={{
          overflow: "auto",
          padding: "8px 10px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "10px",
          backdropFilter: "blur(6px)",
          minHeight: 0,
        }}
      >
        <PlayerBoard
          playerId="current"
          hand={currentPlayer.hand}
          personalStacks={currentPlayer.personalStacks}
          rightStack={currentPlayer.rightStack}
          onCardDrop={onCardDrop}
        />
      </div>
    </div>
  );
}