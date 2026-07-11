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
  const gap = "clamp(0.25rem, 1vw, 1rem)";
  const padding = "clamp(0.125rem, 0.5vw, 0.5rem)";

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        gap,
        padding,
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "clamp(0.8rem, 2.5vw, 1.5rem)", whiteSpace: "nowrap" }}>
        Center
      </h3>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minWidth: 0,
        gap,
        overflow: "hidden",
        flex: 1,
        minHeight: 0,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "clamp(0.125rem, 0.5vw, 0.5rem)",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
        }}>
          {scales.map((scale, index) => (
            <CardPile
              key={index}
              cards={scale?.cards ?? []}
              stackId={`center-${index + 1}`}
              layout="stack"
              scatter
              onCardDrop={onDrop}
              allowedSourceIds={["hand","personal","side-1","side-2","side-3","side-4"]}
            />
          ))}
        </div>

        <div style={{ flexShrink: 1, minWidth: 0 }}>
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