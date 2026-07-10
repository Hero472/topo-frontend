import CardPile from "./CardPile";
import type { Scale, DeckColor } from "../types/types";
import type { CardDropEvent } from "../hooks/useDropTarget";

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
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <h3>Center</h3>


      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3rem",
        }}
      >
        {/* Scales */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, auto)",
            gap: "1rem",
          }}
        >
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

        {/* Dealer pile */}
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
    </section>
  );
}