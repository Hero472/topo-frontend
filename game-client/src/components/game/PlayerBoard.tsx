import CardPile from "./CardPile";
import type { Card, PlayerBoard as PlayerBoardType } from "../../types/types";
import type { CardDropEvent } from "../../hooks/useDropTarget";
import { cn } from "../../lib/utils";

interface Props {
  board: PlayerBoardType;
  onDrop: (event: CardDropEvent) => void;
  isMyTurn: boolean;
  playerName?: string;
}

export default function PlayerBoard({
  board,
  onDrop,
  isMyTurn,
  playerName = "You",
}: Readonly<Props>) {

  const personalPreviewCards: Card[] = [
    ...board.personal.colors.map((deck) => ({ suit: "spades" as const, value: 0, deck })),
    ...(board.personal.top ? [board.personal.top] : []),
  ];

  return (
    <section 
      className={cn(
        "relative flex flex-col items-center gap-1 sm:gap-3 p-2 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300",
        isMyTurn 
          ? "ring-2 ring-brand-primary bg-background-secondary/80 shadow-xl shadow-brand-primary/10" 
          : "ring-1 ring-border-primary bg-background-secondary/40"
      )}
    >
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm border transition-colors duration-300",
          isMyTurn ? "bg-brand-primary text-white border-brand-primary" : "bg-background-primary text-foreground-tertiary border-border-primary"
        )}>
          {playerName}
        </span>
      </div>

      {/* Top Row: Strictly horizontal on ALL screens */}
      <div className="flex items-end justify-center gap-1 sm:gap-3 w-full">
        <div className="flex items-end justify-center gap-1 sm:gap-2 flex-1 min-w-0">
          {board.side.map((stack, index) => (
            <CardPile
              key={`side-${index}`}
              cards={stack}
              stackId={`side-${index + 1}`}
              layout="stack"
              small // ✅ Makes cards compact on mobile
              overlap={1.5}
              scatter
              draggable={isMyTurn}
              onCardDrop={onDrop}
              allowedSourceIds={["hand", "personal", `side-${index + 1}`]}
            />
          ))}
        </div>

        <div className="flex-shrink-0">
          <CardPile
            cards={personalPreviewCards}
            stackId="personal"
            layout="stack"
            small
            scatter
            showOnlyTopFace
            count={board.personal.count}
            draggable={isMyTurn}
            onCardDrop={onDrop}
            allowedSourceIds={[]}
          />
        </div>
      </div>

      {/* Hand row */}
      <div className="w-full flex justify-center pt-1 sm:pt-3">
        <CardPile
          cards={board.hand}
          stackId="hand"
          layout="hand"
          small // ✅ Compact hand cards on mobile
          overlap={24} // 24px horizontal spacing fits perfectly on mobile
          draggable={isMyTurn}
          onCardDrop={onDrop}
          allowedSourceIds={["draw"]}
        />
      </div>
    </section>
  );
}