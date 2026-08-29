import { useState } from "react";
import CardView from "../components/game/CardView";
import CardPile from "../components/game/CardPile";
import type { Card } from "../types/types";
import type { CardDropEvent } from "../hooks/useDropTarget";
import "./DebugPage.css";

const initialCards: Card[] = [
  { suit: "hearts", value: 1, deck: "red" },
  { suit: "diamonds", value: 7, deck: "blue" },
  { suit: "clubs", value: 10, deck: "red" },
  { suit: "spades", value: 13, deck: "blue" },
];

export default function DebugPage() {
  const [piles, setPiles] = useState<Record<string, Card[]>>({
    "debug-hand": initialCards,
    "debug-stack": [],
    "debug-face-down": [],
  });

  function handleDrop(event: CardDropEvent) {
    const { card, sourceStackId, targetStackId } = event;

    setPiles((prev) => {
      const sourceCards = [...prev[sourceStackId]];
      // ✅ Safer removal: match by properties in case the object was cloned during drag
      const cardIndex = sourceCards.findIndex(
        (c) => c.suit === card.suit && c.value === card.value && c.deck === card.deck
      );
      
      if (cardIndex !== -1) {
        sourceCards.splice(cardIndex, 1);
      }
      
      return {
        ...prev,
        [sourceStackId]: sourceCards,
        [targetStackId]: [...prev[targetStackId], card],
      };
    });
  }

  return (
    <main className="debug-page">
      <h1>Card Debug</h1>

      <section className="debug-section">
        <h2>CardView</h2>
        <div className="debug-cards">
          {initialCards.map((card, index) => (
            <CardView key={`${card.deck}-${card.suit}-${card.value}-${index}`} card={card} />
          ))}
        </div>
      </section>

      <section className="debug-section">
        <h2>Hand</h2>
        <CardPile
          cards={piles["debug-hand"]}
          stackId="debug-hand"
          layout="hand"
          overlap={3}
          draggable
          allowedSourceIds={["debug-stack", "stack"]}
          onCardDrop={handleDrop}
        />
      </section>

      <section className="debug-section">
        <h2>Stack</h2>
        <CardPile
          cards={piles["debug-stack"]}
          stackId="debug-stack"
          layout="stack"
          scatter
          draggable
          allowedSourceIds={["debug-hand", "stack"]}
          onCardDrop={handleDrop}
        />
      </section>

      <section className="debug-section">
        <h2>Face Down</h2>
        <CardPile
          cards={piles["debug-face-down"]}
          stackId="debug-face-down"
          layout="stack"
          faceDown
          draggable
          allowedSourceIds={["debug-hand", "debug-stack"]}
          onCardDrop={handleDrop}
        />
      </section>
    </main>
  );
}