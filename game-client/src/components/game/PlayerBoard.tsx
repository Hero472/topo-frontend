import CardPile from "./CardPile";
import type { Card, PlayerBoard as PlayerBoardType } from "../../types/types";
import type { CardDropEvent } from "../../hooks/useDropTarget";
import { cn } from "../../lib/utils";

interface Props {
  board: PlayerBoardType;
  onDrop: (event: CardDropEvent) => void;
  isMyTurn: boolean;
  playerName?: string; // Optional: defaults to "You", but useful if reused for opponents
}

export default function PlayerBoard({
  board,
  onDrop,
  isMyTurn,
  playerName = "You",
}: Readonly<Props>) {

  const personalPreviewCards: Card[] = [
    ...board.personal.colors.map((deck) => ({
      suit: "spades" as const,
      value: 0,
      deck,
    })),
    ...(board.personal.top ? [board.personal.top] : []),
  ];

  return (
    <section 
      className={cn(
        "relative flex flex-col items-center gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-300",
        isMyTurn 
          ? "ring-2 ring-brand-primary bg-background-secondary/80 shadow-xl shadow-brand-primary/10" 
          : "ring-1 ring-border-primary bg-background-secondary/40"
      )}
    >
      {/* Player Name Badge (Floats above the board) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border transition-colors duration-300",
          isMyTurn 
            ? "bg-brand-primary text-white border-brand-primary" 
            : "bg-background-primary text-foreground-tertiary border-border-primary"
        )}>
          {playerName}
        </span>
      </div>

      {/* Top Row: Side piles + Personal pile */}
      <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6 w-full">
        
        {/* Side piles wrapper */}
        <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-4 flex-1 min-w-0">
          {board.side.map((stack, index) => (
            <CardPile
              key={`side-${index}`}
              cards={stack}
              stackId={`side-${index + 1}`}
              layout="stack"
              scatter
              overlap={2}
              draggable={isMyTurn}
              onCardDrop={onDrop}
              allowedSourceIds={[
                "hand",
                "personal",
                `side-${index + 1}`,
              ]}
            />
          ))}
        </div>

        {/* Personal pile wrapper */}
        <div className="flex-shrink-0">
          <CardPile
            cards={personalPreviewCards}
            stackId="personal"
            layout="stack"
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
      <div className="w-full flex justify-center pt-2">
        <CardPile
          cards={board.hand}
          stackId="hand"
          layout="hand"
          overlap={40}
          draggable={isMyTurn}
          onCardDrop={onDrop}
          allowedSourceIds={["draw"]}
        />
      </div>
    </section>
  );
}