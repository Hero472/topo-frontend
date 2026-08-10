import React from "react";
import CardView from "./CardView";
import { useDropTarget, type CardDropEvent } from "../../hooks/useDropTarget";
import { useDrag } from "../../hooks/useDrag";
import type { Card } from "../../types/types";
import { cardKey } from "../../utils/cardKey";
import "./CardPile.css";
import { useDragStore } from "../../store/useDragStore";

interface CardPileProps {
  cards: Card[];
  stackId: string;
  layout: "stack" | "hand";

  draggable?: boolean;
  allowedSourceIds?: string[];
  allowSelfDrop?: boolean;

  onCardDrop?: (event: CardDropEvent) => void;

  faceDown?: boolean;
  showOnlyTopFace?: boolean;

  small?: boolean;
  resolution?: "x1" | "x2";

  overlap?: number;             // in em
  offset?: number;              // in px

  scatter?: boolean;
  scatterMaxRotation?: number;
  scatterMaxTranslate?: number; // in px

  rotation?: number;
  count?: number;
  emptyLabel?: string;
}

function random(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getScatter(index: number, card: Card, maxRotation: number, maxTranslate: number) {
  const seed = index * 137 + card.value * 53 + card.suit.length * 17;
  return {
    rotation: (random(seed) * 2 - 1) * maxRotation,
    x: (random(seed + 1) * 2 - 1) * maxTranslate,
    y: (random(seed + 2) * 2 - 1) * maxTranslate,
  };
}

function DraggableCard({
  card,
  stackId,
  draggable,
  itemStyles,
  small,
  resolution,
  showBack,
  onCardDrop,
}: Readonly<{
  card: Card;
  stackId: string;
  draggable: boolean;
  itemStyles: React.CSSProperties;
  small: boolean;
  resolution: "x1" | "x2";
  showBack: boolean;
  onCardDrop?: (event: CardDropEvent) => void;
}>) {
  const drag = useDrag({
    card,
    stackId,
    enabled: draggable,
    onDrop: onCardDrop,
  });

  const dragging = useDragStore(
    (s) =>
      s.dragging &&
      s.sourceStackId === stackId &&
      s.card != null &&
      cardKey(s.card) === cardKey(card)
  );

  return (
    <div
      className={`card-pile-item ${draggable ? "is-draggable" : ""}`}
      style={{
        ...itemStyles,
        opacity: dragging ? 0 : 1,
      }}
      onPointerDown={drag.onPointerDown}
    >
      <CardView
        card={card}
        small={small}
        resolution={resolution}
        showBack={showBack}
      />
    </div>
  );
}

export default function CardPile({
  cards,
  stackId,
  layout,
  draggable = true,
  allowedSourceIds,
  onCardDrop,
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
  const { ref, dragOver } = useDropTarget({ stackId, allowedSourceIds, allowSelfDrop });

  const badge = count ?? cards.length;
  const displayEmptyLabel = emptyLabel || stackId;   // show the stackId when empty

  // Combine parent-level configurations into a clean CSS custom properties object
  const pileStyles = {
    "--pile-rotation": `${rotation}deg`,
    "--overlap-em": `${overlap}em`,
    "--offset-px": `${offset}px`,
    "--total-cards": cards.length
  } as React.CSSProperties;

  const renderedCards = cards.map((card, index) => {
    const isTop = index === cards.length - 1;
    const canDrag =
      draggable && (layout === "hand" || isTop);

    const scatterValues = scatter
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

    const itemStyles = {
      "--card-index": index,
      "--scatter-x": `${scatterValues.x}px`,
      "--scatter-y": `${scatterValues.y}px`,
      "--scatter-rot": `${scatterValues.rotation}deg`,
    } as React.CSSProperties;

    return (
      <DraggableCard
        key={`${cardKey(card)}-${index}`}
        card={card}
        stackId={stackId}
        draggable={canDrag}
        itemStyles={itemStyles}
        small={small}
        resolution={resolution}
        showBack={
          faceDown ||
          (showOnlyTopFace && !isTop)
        }
        onCardDrop={onCardDrop}
      />
    );
  });

  return (
    <div className="card-pile-wrapper" style={pileStyles}>
      <div
        ref={ref}
        className={`card-pile-container layout-${layout} ${
          small ? "size-small" : "size-normal"
        } ${dragOver ? "is-drag-over" : ""}`}
        data-empty={cards.length === 0 || undefined}
      >
        {cards.length === 0 && displayEmptyLabel && (
          <span className="card-pile-empty-label">
            {displayEmptyLabel}
          </span>
        )}

        {badge > 1 && (
          <div className="card-pile-badge">
            {badge}
          </div>
        )}

        {renderedCards}
      </div>
    </div>
  );
}