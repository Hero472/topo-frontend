import CardView from "../components/game/CardView";
import CardPile from "../components/game/CardPile";
import type { Card } from "../types/types";
import "./DebugPage.css";

const cards: Card[] = [
    { suit: "hearts", value: 1, deck: "red" },
    { suit: "diamonds", value: 7, deck: "blue" },
    { suit: "clubs", value: 10, deck: "red" },
    { suit: "spades", value: 13, deck: "blue" },
];

export default function DebugPage() {
    return (
        <main className="debug-page">
            <h1>Card Debug</h1>

            <section className="debug-section">
                <h2>CardView</h2>

                <div className="debug-cards">
                    {cards.map((card, index) => (
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
                    cards={cards}
                    stackId="debug-hand"
                    layout="hand"
                    overlap={3}
                />
            </section>

            <section className="debug-section">
                <h2>Stack</h2>

                <CardPile
                    cards={cards}
                    stackId="debug-stack"
                    layout="stack"
                    scatter
                />
            </section>

            <section className="debug-section">
                <h2>Face Down</h2>

                <CardPile
                    cards={cards}
                    stackId="debug-face-down"
                    layout="stack"
                    faceDown
                    count={20}
                />
            </section>
        </main>
    );
}