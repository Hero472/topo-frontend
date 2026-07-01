import CardView from "./CardView";
import { useDropTarget } from "../hooks/useDropTarget";
import type { Card } from "../types/types";

interface Props {
  cards: Card[];
  small?: boolean;
  resolution?: "x1" | "x2";
  emptyLabel?: string;
  overlap?: number;
  faceDown?: boolean;

  draggable?: boolean;
  stackId?: string;
  onCardDrop?: (card: Card, sourceStackId: string) => void;
  allowedSourceIds?: string[];
  onDragStartCard?: (card: Card, sourceStackId: string) => void;
  onDragEndCard?: (
    card: Card,
    sourceStackId: string,
    targetStackId?: string
  ) => void;
  allowSelfDrop?: boolean;
}

export default function CardHand({
  cards,
  small = false,
  resolution = "x1",
  emptyLabel = "No cards",
  overlap = 2,
  faceDown = false,
  draggable = true,
  stackId = "",
  onCardDrop,
  allowedSourceIds,
  onDragStartCard,
  onDragEndCard,
  allowSelfDrop = false,
}: Readonly<Props>) {
  const { dragOver, handlers } = useDropTarget({
    draggable,
    stackId,
    onCardDrop,
    allowedSourceIds,
    onDragStartCard,
    onDragEndCard,
    allowSelfDrop,
  });

  const cardHeight = small ? "4.9em" : "7em";
  const cardWidth = small ? "3.5em" : "5em";

  const handWidth =
    cards.length === 0
      ? cardWidth
      : `calc(${cardWidth} + ${(cards.length - 1) * overlap}em)`;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: handWidth,
        height: cardHeight,
        outline: dragOver ? "2px dashed #4a90e2" : "none",
        outlineOffset: 2,
        borderRadius: small ? "4px" : "6px",
        transition: "outline 0.15s ease",
      }}
      onDragOver={handlers.onDragOver}
      onDragLeave={handlers.onDragLeave}
      onDrop={handlers.onDrop}
    >
      {cards.length === 0 ? (
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#999",
            whiteSpace: "nowrap",
          }}
        >
          {emptyLabel}
        </span>
      ) : (
        cards.map((card, index) => {
          const canDrag = draggable;
          return (
            <div
              key={card.id}
              draggable={canDrag}
              onDragStart={(e) => handlers.onDragStart(e, card)}
              onDragEnd={handlers.onDragEnd}
              style={{
                position: "absolute",
                left: `calc(${index} * ${overlap}em)`,
                top: 0,
                zIndex: index,
                cursor: canDrag ? "grab" : "default",
              }}
            >
              <CardView
                card={card}
                small={small}
                resolution={resolution}
                showBack={faceDown}
              />
            </div>
          );
        })
      )}
    </div>
  );
}