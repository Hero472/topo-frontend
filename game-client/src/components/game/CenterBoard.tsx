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
  const stacks = scales.map((s) => s?.cards ?? []);
  
  // Get the indices of the scales that should be visible
  const visibleIndices = ScaleManager.visibleScaleIndices(stacks);

  const dealerCards: Card[] = [...dealerPreview]
    .reverse()
    .map((deck) => ({
      suit: "spades",
      value: 0,
      deck,
    }));

  return (
    <section className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 gap-2 sm:gap-4 min-h-0">
      
      {/* Main Content Area: Stacks vertically on mobile, side-by-side on desktop */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 flex-1 min-h-0">
        
        {/* Scales Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-1 md:gap-3 w-full flex-1 min-h-0">
          {visibleIndices.map((scaleIndex) => (
            <CardPile
              key={scaleIndex}
              cards={stacks[scaleIndex]}
              stackId={`center-${scaleIndex + 1}`}
              layout="stack"
              scatter
              onCardDrop={onDrop}
              allowedSourceIds={CENTER_ALLOWED_SOURCES}
            />
          ))}
        </div>

        {/* Dealer Deck Wrapper: Stays compact and doesn't get squished */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <CardPile
            cards={dealerCards}
            stackId="draw"
            layout="stack"
            faceDown
            count={dealerCount}
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