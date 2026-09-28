import CardPile from "./CardPile";
import type { OpponentBoard as OpponentBoardType } from "../../types/types";
import { cn } from "../../lib/utils";

interface Props {
  board: OpponentBoardType;
  isMyTurn: boolean;
}

export default function OpponentBoard({
  board,
  isMyTurn,
}: Readonly<Props>) {

  return (
    <section 
      className={cn(
        "relative flex flex-col items-center gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-300",
        isMyTurn 
          ? "ring-2 ring-brand-primary bg-background-secondary/80 shadow-xl shadow-brand-primary/10" 
          : "ring-1 ring-border-primary bg-background-secondary/40"
      )}
    >
      {/* Opponent Username Badge (Floats above the board) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border transition-colors duration-300",
          isMyTurn 
            ? "bg-brand-primary text-white border-brand-primary" 
            : "bg-background-primary text-foreground-tertiary border-border-primary"
        )}>
          {board.username}
        </span>
      </div>

      {/* Opponent's Hand (Face Down) */}
      <div className="w-full flex justify-center pt-2">
        <CardPile
          cards={board.hand}
          stackId="opponent-hand"
          layout="hand"
          faceDown
          overlap={40}
          draggable={false}
        />
      </div>

      {/* Bottom Row: Personal pile + Side piles */}
      <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6 w-full">
        
        {/* Personal pile wrapper */}
        <div className="flex-shrink-0">
          <CardPile
            cards={board.personal_top ? [board.personal_top] : []}
            stackId="opponent-personal"
            layout="stack"
            scatter
            showOnlyTopFace
            count={board.personal_count}
            draggable={false}
          />
        </div>

        {/* Side piles wrapper */}
        <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-4 flex-1 min-w-0">
          {board.side.map((stack, index) => (
            <CardPile
              key={`side-${index}`}
              cards={stack}
              stackId={`opponent-side-${index + 1}`}
              layout="stack"
              overlap={2}
              scatter
              draggable={false}
            />
          ))}
        </div>

      </div>
    </section>
  );
}