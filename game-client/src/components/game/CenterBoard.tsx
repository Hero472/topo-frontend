import CardPile from "./CardPile";
import type { Scale, DeckColor, Card } from "../../types/types";
import type { CardDropEvent } from "../../hooks/useDropTarget";
import "./CenterBoard.css";
import { ScaleManager } from "../../game/ScaleManager";

interface Props {
  scales: (Scale | null)[];
  dealerCount: number;
  dealerPreview: DeckColor[];
  onDrop: (event: CardDropEvent) => void;
}

const CENTER_ALLOWED_SOURCES = [
  "hand",
  "personal",
  "side-1",
  "side-2",
  "side-3",
  "side-4",
];


export default function CenterBoard({
  scales,
  dealerCount,
  dealerPreview,
  onDrop,
}: Readonly<Props>) {
  const stacks = scales.map(s => s?.cards ?? []);
  const visible = ScaleManager.visibleScaleIndices(stacks);

  const dealerCards: Card[] = [...dealerPreview]
    .reverse()
    .map((deck) => ({
      suit: "spades",
      value: 0,
      deck,
    }));

  return (
    <section className="center-board-container">
      <h3 className="center-board-title">
        Center
      </h3>

      <div className="center-board-content">
        <div className="center-board-scales-grid">
          {visible.map((_, index) => (
            <CardPile
              key={index}
              cards={stacks[index]}
              stackId={`center-${index + 1}`}
              layout="stack"
              scatter
              onCardDrop={onDrop}
              allowedSourceIds={CENTER_ALLOWED_SOURCES}
            />
          ))}
        </div>

        <div className="center-board-dealer-wrapper">
          <CardPile
            cards={dealerCards}
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