import CardPile from "./CardPile";
import type { Scale, DeckColor } from "../../types/types";
import type { CardDropEvent } from "../../hooks/useDropTarget";
import "./CenterBoard.css";
import { ScaleManager } from "../../game/ScaleManager";

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
  const stacks = scales.map(s => s?.cards ?? []);

  const visible = ScaleManager.visibleScaleIndices(stacks);

  return (
    <section className="center-board-container">
      <h3 className="center-board-title">Center</h3>

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

        <div className="center-board-dealer-wrapper">
          <CardPile
            cards={
              dealerTop
                ? [{ suit: "spades", value: 0, deck: dealerTop }]
                : []
            }
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