import CardPile from "./CardPile";
import type { Scale, DeckColor } from "../types/types";
import type { CardDropEvent } from "../hooks/useDropTarget";
import "./CenterBoard.css"; // Import the layout stylesheet

interface Props {
  scales: (Scale | null)[];
  dealerCount: number;
  dealerTop: DeckColor | null;
  onDrop: (event: CardDropEvent) => void;
}

export default function CenterBoard({
  scales,
  dealerCount,
  dealerTop,
  onDrop,
}: Readonly<Props>) {
  return (
    <section className="center-board-container">
      <h3 className="center-board-title">Center</h3>

      <div className="center-board-content">
        {/* Scales Grid System */}
        <div className="center-board-scales-grid">
          {scales.map((scale, index) => (
            <CardPile
              key={index}
              cards={scale?.cards ?? []}
              stackId={`center-${index + 1}`}
              layout="stack"
              scatter
              onCardDrop={onDrop}
              allowedSourceIds={[
                "hand",
                "personal",
                "side-1",
                "side-2",
                "side-3",
                "side-4",
              ]}
            />
          ))}
        </div>

        {/* Dealer Deck Frame */}
        <div className="center-board-dealer-wrapper">
          <CardPile
            cards={dealerTop ? [{ suit: "spades", value: 0, deck: dealerTop }] : []}
            stackId="draw"
            layout="stack"
            faceDown
            count={dealerCount}
            draggable
            onCardDrop={onDrop}
            allowedSourceIds={[]}
          />
        </div>
      </div>
    </section>
  );
}