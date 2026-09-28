import React from "react";
import CardView from "./CardView";
import { useDropTarget, type CardDropEvent } from "../../hooks/useDropTarget";
import { useDrag } from "../../hooks/useDrag";
import type { Card } from "../../types/types";
import { cardKey } from "../../utils/cardKey";
import { useDragStore } from "../../store/useDragStore";
import { cn } from "../../lib/utils";

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
  overlap?: number; // Now properly controls horizontal spacing for hands!
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
  isTop,
  badge,
  isScrollableHand,
  isBaseCard,
}: Readonly<{
  card: Card;
  stackId: string;
  draggable: boolean;
  itemStyles: React.CSSProperties;
  small: boolean;
  resolution: "x1" | "x2";
  showBack: boolean;
  onCardDrop?: (event: CardDropEvent) => void;
  isTop: boolean;
  badge: number;
  isScrollableHand: boolean;
  isBaseCard: boolean;
}>) {
  const drag = useDrag({ card, stackId, enabled: draggable, onDrop: onCardDrop });

  const dragging = useDragStore(
    (s) => s.dragging && s.sourceStackId === stackId && s.card != null && cardKey(s.card) === cardKey(card)
  );

  return (
    <div
      className={cn(
        "transition-transform duration-200 ease-out",
        isBaseCard ? "relative" : "absolute top-0 left-0",
        draggable 
          ? "cursor-grab active:cursor-grabbing hover:-translate-y-2 hover:shadow-xl active:scale-105" 
          : ""
      )}
      style={{
        ...itemStyles,
        opacity: dragging ? 0.4 : 1,
      }}
      onPointerDown={drag.onPointerDown}
    >
      <CardView card={card} small={small} resolution={resolution} showBack={showBack} />
      
      {isTop && badge > 1 && !isScrollableHand && (
        <div className="absolute -top-1.5 -right-1.5 z-50 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[9px] sm:text-[10px] font-bold text-white shadow-sm ring-2 ring-background-primary pointer-events-none">
          {badge}
        </div>
      )}
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
  overlap = 0,
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
  const displayEmptyLabel = emptyLabel || stackId;
  const isScrollableHand = layout === "hand";
  const isStack = layout === "stack";

  const maxStackHeightEm = 24; 
  const cardHeightEm = 8; 
  
  const dynamicOverlap = cards.length > 1 && isStack
    ? Math.min(overlap, (maxStackHeightEm - cardHeightEm) / (cards.length - 1))
    : overlap;

  const totalStackHeightEm = cardHeightEm + (cards.length - 1) * dynamicOverlap;

  // ✅ FIX: Now uses the `overlap` prop directly for hand width calculation!
  const handWidth = isScrollableHand 
    ? `calc(${cards.length} * ${overlap}px + 4rem)` 
    : 'auto';

  return (
    <div className="relative">
      <div
        ref={ref}
        className={cn(
          "relative transition-all duration-200 rounded-xl",
          isScrollableHand
            ? "w-full flex items-end overflow-x-auto pt-4 sm:pt-6 pb-3 px-2 touch-pan-x"
            : "w-fit min-w-20 sm:min-w-24 md:min-w-28 min-h-32 sm:min-h-40 flex items-center justify-center border-2 border-dashed",
          !isScrollableHand && (
            dragOver
              ? "border-brand-primary bg-brand-primary/10 scale-[1.02]"
              : "border-border-primary/50 bg-background-tertiary/30"
          )
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        <div 
          className="relative"
          style={{ 
            width: handWidth,
            minHeight: isStack ? `${totalStackHeightEm}em` : (isScrollableHand ? '7rem' : 'auto')
          }}
        >
          {cards.length === 0 && isStack && (
            <div className="w-20 sm:w-24 md:w-28 aspect-[5/7] rounded-xl flex items-center justify-center text-foreground-quaternary text-xs font-medium select-none pointer-events-none">
              {displayEmptyLabel}
            </div>
          )}

          {cards.length === 0 && isScrollableHand && (
            <div className="absolute inset-0 flex items-center justify-center text-foreground-quaternary text-sm font-medium select-none pointer-events-none border-2 border-dashed border-border-primary/30 rounded-xl">
              {displayEmptyLabel || "No cards"}
            </div>
          )}

          {cards.map((card, index) => {
            const isTop = index === cards.length - 1;
            const canDrag = draggable && (layout === "hand" || isTop);
            const isBaseCard = index === 0;

            const scatterValues = scatter
              ? getScatter(index, card, scatterMaxRotation, scatterMaxTranslate)
              : { rotation: 0, x: 0, y: 0 };

            // ✅ FIX: Now uses the `overlap` prop directly for horizontal spacing in hands!
            const translateX = isScrollableHand 
              ? `${index * overlap}px`
              : `${index * offset}px`;
            
            const transform = isScrollableHand
              ? `translateX(${translateX}) rotate(${rotation + scatterValues.rotation}deg) translateY(${scatterValues.y}px)`
              : `translate(calc(${scatterValues.x}px + ${index * offset}px), calc(${index * dynamicOverlap}em + ${scatterValues.y}px)) rotate(${rotation + scatterValues.rotation}deg)`;

            const itemStyles: React.CSSProperties = {
              zIndex: index,
              transform,
            };

            return (
              <DraggableCard
                key={`${cardKey(card)}-${index}`}
                card={card}
                stackId={stackId}
                draggable={canDrag}
                itemStyles={itemStyles}
                small={small}
                resolution={resolution}
                showBack={faceDown || (showOnlyTopFace && !isTop)}
                onCardDrop={onCardDrop}
                isTop={isTop}
                badge={badge}
                isScrollableHand={isScrollableHand}
                isBaseCard={isBaseCard}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}