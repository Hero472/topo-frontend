import React, { useMemo } from "react";
import CardView from "./CardView";
import { useDropTarget, type CardDropEvent } from "../hooks/useDropTarget";
import type { Card } from "../types/types";
import { cardKey } from "../utils/cardKey";
import "./CardPile.css";

interface CardPileProps {
  cards: Card[];
  stackId: string;
  layout: "stack" | "hand";
  draggable?: boolean;
  allowedSourceIds?: string[];
  onCardDrop?: (event: CardDropEvent) => void;
  onDragStartCard?: (card: Card, sourceStackId: string) => void;
  onDragEndCard?: (card: Card, sourceStackId: string, targetStackId?: string) => void;
  allowSelfDrop?: boolean;
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

  const badge = count ?? cards.length;
  const displayEmptyLabel = emptyLabel || stackId;   // show the stackId when empty

  // Combine parent-level configurations into a clean CSS custom properties object
  const pileStyles = {
    "--pile-rotation": `${rotation}deg`,
    "--overlap-em": `${overlap}em`,
    "--offset-px": `${offset}px`,
    "--total-cards": cards.length
  } as React.CSSProperties;

  const renderedCards = useMemo(() => {
    return cards.map((card, index) => {
      const isTop = index === cards.length - 1;
      const isDraggable = draggable && (layout === "hand" || isTop);

      const s = scatter
        ? getScatter(index, card, scatterMaxRotation, scatterMaxTranslate)
        : { rotation: 0, x: 0, y: 0 };

      const itemStyles = {
        "--card-index": index,
        "--scatter-x": `${s.x}px`,
        "--scatter-y": `${s.y}px`,
        "--scatter-rot": `${s.rotation}deg`,
      } as React.CSSProperties;

      return (
        <div
          key={cardKey(card)}
          className={`card-pile-item ${isDraggable ? "is-draggable" : ""}`}
          style={itemStyles}
          draggable={isDraggable}
          onDragStart={(e) => handlers.onDragStart(e, card)}
          onDragEnd={handlers.onDragEnd}
        >
          <CardView
            card={card}
            small={small}
            resolution={resolution}
            showBack={faceDown || (showOnlyTopFace && !isTop)}
          />
        </div>
      );
    });
  }, [cards, draggable, layout, scatter, scatterMaxRotation, scatterMaxTranslate, small, resolution, faceDown, showOnlyTopFace, handlers]);

  return (
    <div className="card-pile-wrapper" style={pileStyles}>
      <div
        className={`card-pile-container layout-${layout} ${small ? "size-small" : "size-normal"} ${dragOver ? "is-drag-over" : ""}`}
        data-empty={cards.length === 0 || undefined}
        onDragOver={handlers.onDragOver}
        onDragEnter={handlers.onDragEnter}
        onDragLeave={handlers.onDragLeave}
        onDrop={handlers.onDrop}
      >
        {cards.length === 0 && displayEmptyLabel && (
          <span className="card-pile-empty-label">{displayEmptyLabel}</span>
        )}

        {badge > 1 && (
          <div className="card-pile-badge">{badge}</div>
        )}

        {renderedCards}
      </div>
    </div>
  );
}