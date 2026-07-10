import CardView from "./CardView";
import { useDropTarget, type CardDropEvent } from "../hooks/useDropTarget";
import type { Card } from "../types/types";

interface Props {
  cards: Card[];

  stackId: string;

  draggable?: boolean;

  allowedSourceIds?: string[];

  onCardDrop?: (
    event: CardDropEvent
  ) => void;

  onDragStartCard?: (
    card: Card,
    sourceStackId: string
  ) => void;

  onDragEndCard?: (
    card: Card,
    sourceStackId: string,
    targetStackId?: string
  ) => void;

  allowSelfDrop?: boolean;

  small?: boolean;

  resolution?: "x1" | "x2";

  offsetY?: number;

  scatter?: boolean;

  showOnlyTopFace?: boolean;

  faceDown?: boolean;

  count?: number;
}

export default function CardStack({
  cards,
  stackId,

  draggable = true,

  allowedSourceIds,

  onCardDrop,

  onDragStartCard,

  onDragEndCard,

  allowSelfDrop = false,

  small = false,

  resolution = "x1",

  offsetY = 0,

  // scatter = true,

  showOnlyTopFace = false,

  faceDown = false,

  count,
}: Props) {
  const { dragOver, handlers } =
    useDropTarget({
      stackId,
      draggable,
      allowedSourceIds,
      onCardDrop,
      onDragStartCard,
      onDragEndCard,
      allowSelfDrop,
    });

  const width = small ? "4em" : "6em";
  const height = small ? "5.6em" : "8.4em";

  return (
    <div
      onDragOver={handlers.onDragOver}
      onDrop={handlers.onDrop}
      onDragLeave={handlers.onDragLeave}
      style={{
        position: "relative",
        display: "inline-block",
        width,
        height: `calc(${height} + ${
          (cards.length - 1) * offsetY
        }px)`,
        outline: dragOver
          ? "2px dashed #4a90e2"
          : undefined,
      }}
    >
      {count && count > 1 && (
        <div
          style={{
            position: "absolute",
            right: 4,
            bottom: 4,
            zIndex: 999,
          }}
        >
          {count}
        </div>
      )}

      {cards.map((card, index) => {
        const top =
          index === cards.length - 1;

        return (
          <div
            key={card.id}
            style={{
              position: "absolute",
              top: index * offsetY,
              left: 0,
              zIndex: index,
            }}
            draggable={draggable && top}
            onDragStart={(e) =>
              handlers.onDragStart(e, card)
            }
            onDragEnd={handlers.onDragEnd}
          >
            <CardView
              card={card}
              small={small}
              resolution={resolution}
              showBack={
                faceDown ||
                (showOnlyTopFace && !top)
              }
            />
          </div>
        );
      })}
    </div>
  );
}