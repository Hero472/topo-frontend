// src/pages/DebugPage.tsx
import { useState } from "react";
import type { Card } from "../types/types";
import CardStack from "../components/CardStack";
import CardHand from "../components/CardHand";

const createCard = (
  suit: Card["suit"],
  value: number,
  deck: Card["deck"]
): Card => ({
  id: `${suit}-${value}-${deck}-${Math.random().toString(36).slice(2, 8)}`,
  suit,
  value,
  deck,
});

const initialHand: Card[] = [
  createCard("hearts", 12, "blue"),
  createCard("clubs", 13, "blue"),
  createCard("diamonds", 7, "blue"),
  createCard("diamonds", 7, "blue"),
];

const decorativeCards: Card[] = [
  createCard("hearts", 12, "blue"),
  createCard("clubs", 13, "blue"),
  createCard("diamonds", 7, "blue"),
  createCard("diamonds", 7, "blue"),
];

export function DebugPage() {
  const [hand, setHand] = useState<Card[]>(initialHand);
  const [drawPile, setDrawPile] = useState<Card[]>(decorativeCards);
  const [foundation, setFoundation] = useState<Card[]>([]);

  const moveCard = (card: Card, sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    // 1. Remove from source
    if (sourceId === "hand") {
      setHand((prev) => prev.filter((c) => c.id !== card.id));
    } else if (sourceId === "draw") {
      setDrawPile((prev) => prev.filter((c) => c.id !== card.id));
    } else if (sourceId === "foundation") {
      setFoundation((prev) => prev.filter((c) => c.id !== card.id));
    }

    // 2. Add to target
    if (targetId === "hand") {
      setHand((prev) => [...prev, card]);
    } else if (targetId === "draw") {
      setDrawPile((prev) => [...prev, card]);
    } else if (targetId === "foundation") {
      setFoundation((prev) => [...prev, card]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", gap: "2rem" }}>
        <CardHand
          cards={hand}
          stackId="hand"
          overlap={1.2}
          draggable
          onCardDrop={(card, sourceId) => moveCard(card, sourceId, "hand")}
          allowedSourceIds={["foundation"]}
        />

        <CardStack
          cards={drawPile}
          offsetY={16}
          draggable
          stackId="draw"
          onCardDrop={(card, sourceId) => moveCard(card, sourceId, "draw")}
          allowedSourceIds={["hand", "foundation"]}
        />

        <CardStack
          cards={foundation}
          offsetY={16}
          draggable
          stackId="foundation"
          onCardDrop={(card, sourceId) => moveCard(card, sourceId, "foundation")}
          allowedSourceIds={["hand", "draw"]}
        />
      </div>

      <button
        onClick={() => {
          if (foundation.length === 0) return;
          foundation.forEach((card) => moveCard(card, "foundation", "draw"));
        }}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          width: "fit-content",
        }}
      >
        Move all foundation cards back to draw pile
      </button>
    </div>
  );
}