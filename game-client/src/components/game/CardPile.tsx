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

  // ✅ TIGHTER MATH: 5em is exactly ~80px, which perfectly matches the 5:7 ratio of a 56px wide card
  const maxStackHeightEm = 15; 
  const cardHeightEm = 5; 
  
  const dynamicOverlap = cards.length > 1 && isStack && overlap > 0
    ? Math.min(overlap, (maxStackHeightEm - cardHeightEm) / (cards.length - 1))
    : overlap;

  const totalStackHeightEm = cardHeightEm + (cards.length - 1) * dynamicOverlap;

  const handWidth = isScrollableHand 
    ? `calc(${cards.length} * ${overlap}px + 4rem)` 
    : 'auto';

  // ✅ EXACT 5:7 ASPECT RATIO HEIGHTS
  // These perfectly hug the cards at every breakpoint, eliminating empty space
  const minWidthClass = small 
    ? "min-w-14 sm:min-w-16 md:min-w-20" 
    : "min-w-16 sm:min-w-20 md:min-w-24 lg:min-w-28";

  const minHeightClass = small 
    ? "min-h-[78px] sm:min-h-[90px] md:min-h-[112px]" 
    : "min-h-[90px] sm:min-h-[112px] md:min-h-[134px] lg:min-h-[157px]";

  const emptyWidthClass = small
    ? "w-14 sm:w-16 md:w-20"
    : "w-16 sm:w-20 md:w-24 lg:w-28";

  return (
    <div className="relative">
      <div
        ref={ref}
        className={cn(
          "relative transition-all duration-200 rounded-xl",
          isScrollableHand
            ? "w-full flex items-end overflow-x-auto pt-3 sm:pt-5 pb-2 px-1 sm:px-2 touch-pan-x"
            : `w-fit ${minWidthClass} ${minHeightClass} flex items-center justify-center border-2 border-dashed`,
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
            minHeight: isStack ? `${totalStackHeightEm}em` : (isScrollableHand ? (small ? '78px' : '90px') : 'auto')
          }}
        >
          {/* Empty State for Stacks (Uses aspect-[5/7] to perfectly match card size) */}
          {cards.length === 0 && isStack && (
            <div className={cn(
              emptyWidthClass,
              "aspect-[5/7] rounded-xl flex items-center justify-center text-foreground-quaternary text-xs font-medium select-none pointer-events-none"
            )}>
              {displayEmptyLabel}
            </div>
          )}

          {/* Empty State for Hands */}
          {cards.length === 0 && isScrollableHand && (
            <div className={cn(
              small ? "h-[78px] sm:h-[90px]" : "h-[90px] sm:h-[112px]",
              "w-full flex items-center justify-center text-foreground-quaternary text-sm font-medium select-none pointer-events-none border-2 border-dashed border-border-primary/30 rounded-xl"
            )}>
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

            const translateX = isScrollableHand 
              ? `${index * overlap}px`
              : `${index * offset}px`;
            
            const translateY = isScrollableHand
              ? `${scatterValues.y}px`
              : `calc(${index * dynamicOverlap}em + ${scatterValues.y}px)`;

            const transform = `translate(calc(${scatterValues.x}px + ${translateX}), ${translateY}) rotate(${rotation + scatterValues.rotation}deg)`;

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