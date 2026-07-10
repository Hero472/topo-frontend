import React from "react";
import CardView from "./CardView";
import { useDropTarget, type CardDropEvent } from "../hooks/useDropTarget";
import type { Card } from "../types/types";
import { cardKey } from "../utils/cardKey";

interface CardPileProps {
  cards: Card[];
  stackId: string;
  layout: "stack" | "hand";
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
  faceDown?: boolean;
  showOnlyTopFace?: boolean;
  small?: boolean;
  resolution?: "x1" | "x2";
  overlap?: number;
  offset?: number;
  scatter?: boolean;
  scatterMaxRotation?: number;
  scatterMaxTranslate?: number;
  rotation?: number;
  count?: number;
  emptyLabel?: string;
}

function random(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getScatter(
  index: number,
  card: Card,
  maxRotation: number,
  maxTranslate: number
) {
  const seed =
    index * 137 +
    card.value * 53 +
    card.suit.length * 17;

  return {
    rotation: (random(seed) * 2 - 1) * maxRotation,
    x: (random(seed + 1) * 2 - 1) * maxTranslate,
    y: (random(seed + 2) * 2 - 1) * maxTranslate,
  };
}

export default function CardPile({
  cards,
  stackId,
  layout,
  draggable = true,
  allowedSourceIds,

  onCardDrop,
  onDragStartCard,
  onDragEndCard,

  allowSelfDrop = false,
  faceDown = false,
  showOnlyTopFace = false,
  small = false,
  resolution = "x1",
  overlap = 2,
  offset = 0,
  scatter = false,
  scatterMaxRotation = 2,
  scatterMaxTranslate = 2,
  rotation = 0,
  count,
  emptyLabel = "",
}: Readonly<CardPileProps>) {
  const { dragOver, handlers } = useDropTarget({
    stackId,
    draggable,
    allowedSourceIds,
    onCardDrop,
    onDragStartCard,
    onDragEndCard,
    allowSelfDrop,
  });

  const cardWidth = small ? "4em" : "6em";
  const cardHeight = small ? "5.6em" : "8.4em";

  const width =
    layout === "hand"
      ? cards.length === 0
        ? cardWidth
        : `calc(${cardWidth} + ${(cards.length - 1) * overlap}em)`
      : cardWidth;

  const height =
    layout === "stack"
      ? cards.length === 0
        ? cardHeight
        : `calc(${cardHeight} + ${(cards.length - 1) * offset}px)`
      : cardHeight;

  const badge = count ?? cards.length;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div
        onDragOver={handlers.onDragOver}
        onDragLeave={handlers.onDragLeave}
        onDrop={handlers.onDrop}
        style={{
          position: "relative",
          width,
          height,
          outline: dragOver ? "2px dashed #4a90e2" : undefined,
          outlineOffset: 2,
          borderRadius: 6,
          transition: "outline .15s ease",
        }}
      >
        {cards.length === 0 && emptyLabel && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#999",
              userSelect: "none",
            }}
          >
            {emptyLabel}
          </span>
        )}

        {badge > 1 && (
          <div
            style={{
              position: "absolute",
              right: 4,
              bottom: 4,
              zIndex: 9999,
              width: small ? "1.2em" : "1.5em",
              height: small ? "1.2em" : "1.5em",
              borderRadius: "50%",
              background: "rgba(0,0,0,.75)",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: small ? ".65rem" : ".75rem",
              pointerEvents: "none",
            }}
          >
            {badge}
          </div>
        )}

        {cards.map((card, index) => {
          const isTop = index === cards.length - 1;

          const s = scatter
            ? getScatter(
                index,
                card,
                scatterMaxRotation,
                scatterMaxTranslate
              )
            : {
                rotation: 0,
                x: 0,
                y: 0,
              };

          const style: React.CSSProperties = {
            position: "absolute",

            left:
              layout === "hand"
                ? `calc(${index} * ${overlap}em)`
                : 0,

            top:
              layout === "stack"
                ? index * offset
                : 0,

            zIndex: index,

            transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rotation}deg)`,

            cursor:
              draggable &&
              (layout === "hand" || isTop)
                ? "grab"
                : "default",
          };

          return (
            <div
              key={cardKey(card)}
              style={style}
              draggable={
                draggable &&
                (layout === "hand" || isTop)
              }
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
                  (showOnlyTopFace && !isTop)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}