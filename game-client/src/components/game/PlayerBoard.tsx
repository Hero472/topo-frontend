import CardPile from "./CardPile";
import type { PlayerBoard as PlayerBoardType } from "../../types/types";
import type { CardDropEvent } from "../../hooks/useDropTarget";
import "./PlayerBoard.css"; // Import the layout stylesheet

interface Props {
  board: PlayerBoardType;
  onDrop: (event: CardDropEvent) => void;
  isMyTurn: boolean;
}

export default function PlayerBoard({
  board,
  onDrop,
  isMyTurn,
}: Readonly<Props>) {
  return (
    <section 
      className="player-board-container" 
      data-active={isMyTurn}
    >
      {/* Row: Side piles + Personal pile */}
      <div className="player-board-piles-row">
        {/* Side piles wrapper */}
        <div className="player-board-side-piles">
          {board.side.map((stack, index) => (
            <CardPile
              key={index}
              cards={stack}
              stackId={`side-${index + 1}`}
              layout="stack"
              offset={26}
              scatter
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
        <div className="player-board-personal-pile">
          <CardPile
            cards={board.personal.top ? [board.personal.top] : []}
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
      <div className="player-board-hand-row">
        <CardPile
          cards={board.hand}
          stackId="hand"
          layout="hand"
          overlap={3}
          draggable={isMyTurn}
          onCardDrop={onDrop}
          allowedSourceIds={["draw"]}
        />
      </div>

      {/* Player name */}
      <h3 className="player-board-title">You</h3>
    </section>
  );
}