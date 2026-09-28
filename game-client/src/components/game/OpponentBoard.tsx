import CardPile from "./CardPile";
import type { OpponentBoard as OpponentBoardType } from "../../types/types";
import { cn } from "../../lib/utils";

interface Props {
  board: OpponentBoardType;
  isMyTurn: boolean;
}

export default function OpponentBoard({ board, isMyTurn }: Readonly<Props>) {
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
          {board.username}
        </span>
      </div>

      {/* Opponent's Hand (Top) */}
      <div className="w-full flex justify-center pt-1 sm:pt-3">
        <CardPile
          cards={board.hand}
          stackId="opponent-hand"
          layout="hand"
          faceDown
          small
          overlap={24}
          draggable={false}
        />
      </div>

      {/* Bottom Row: Strictly horizontal */}
      <div className="flex items-end justify-center gap-1 sm:gap-3 w-full">
        <div className="flex items-end justify-center gap-1 sm:gap-2 flex-1 min-w-0">
          {board.side.map((stack, index) => (
            <CardPile
              key={`side-${index}`}
              cards={stack}
              stackId={`opponent-side-${index + 1}`}
              layout="stack"
              small
              overlap={1.5}
              scatter
              draggable={false}
            />
          ))}
        </div>

        <div className="flex-shrink-0">
          <CardPile
            cards={board.personal_top ? [board.personal_top] : []}
            stackId="opponent-personal"
            layout="stack"
            small
            scatter
            showOnlyTopFace
            count={board.personal_count}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}