import CardPile from "./CardPile";
import type { Scale, DeckColor, Card } from "../../types/types";
import type { CardDropEvent } from "../../hooks/useDropTarget";
import { ScaleManager } from "../../game/ScaleManager";

interface Props {
  scales: (Scale | null)[];
  dealerCount: number;
  dealerPreview: DeckColor[];
  onDrop: (event: CardDropEvent) => void;
}

const CENTER_ALLOWED_SOURCES = ["hand", "personal", "side-1", "side-2", "side-3", "side-4"];

export default function CenterBoard({ scales, dealerCount, dealerPreview, onDrop }: Readonly<Props>) {
  const stacks = scales.map((s) => s?.cards ?? []);
  const visibleIndices = ScaleManager.visibleScaleIndices(stacks);

  const dealerCards: Card[] = [...dealerPreview].reverse().map((deck) => ({ suit: "spades", value: 0, deck }));

  return (
    <section className="w-full h-full flex flex-col items-center justify-center p-1 sm:p-4 gap-1 sm:gap-4 min-h-0">
      
      {/* Main Row: Scales centered, Draw pile pinned to the right */}
      <div className="w-full flex flex-row items-center gap-2 sm:gap-4 flex-1 min-h-0">
        
        {/* Scales: Takes up all available space and centers the piles */}
        <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 min-w-0 overflow-x-auto pb-1">
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {visibleIndices.map((scaleIndex) => (
            <CardPile
              key={scaleIndex}
              cards={stacks[scaleIndex]}
              stackId={`center-${scaleIndex + 1}`}
              layout="stack"
              small
              scatter
              onCardDrop={onDrop}
              allowedSourceIds={CENTER_ALLOWED_SOURCES}
            />
          ))}
        </div>

        {/* Dealer Deck: Pushed to the far right */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <CardPile
            cards={dealerCards}
            stackId="draw"
            layout="stack"
            faceDown
            count={dealerCount}
            small
            draggable
            scatter
            onCardDrop={onDrop}
            allowedSourceIds={[]}
          />
        </div>
        
      </div>
    </section>
  );
}