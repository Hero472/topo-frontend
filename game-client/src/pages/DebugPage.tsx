import { useState } from "react"; // 1. Import useState
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
    // 2. Create state to hold the cards for each pile
    const [piles, setPiles] = useState<Record<string, Card[]>>({
        "debug-hand": initialCards,
        "debug-stack": [],
        "debug-face-down": [],
    });

    function handleDrop(event: CardDropEvent) {
        console.log("Card dropped:", event);
        
        const { card, sourceStackId, targetStackId } = event;

        // 3. Update the state to move the card
        setPiles((prev) => {
            // Remove the card from the source pile
            const updatedSource = prev[sourceStackId].filter((c) => c !== card);
            
            // Add the card to the target pile
            const updatedTarget = [...prev[targetStackId], card];

            // Return the new state object
            return {
                ...prev,
                [sourceStackId]: updatedSource,
                [targetStackId]: updatedTarget,
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
                        <CardView
                            key={`${card.deck}-${card.suit}-${card.value}-${index}`}
                            card={card}
                        />
                    ))}
                </div>
            </section>

            <section className="debug-section">
                <h2>Hand</h2>
                <CardPile
                    cards={piles["debug-hand"]} // 4. Pass state instead of static array
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