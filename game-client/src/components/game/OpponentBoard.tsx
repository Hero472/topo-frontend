import CardPile from "./CardPile";
import type { OpponentBoard as OpponentBoardType } from "../../types/types";
import "./OpponentBoard.css"; // Import the layout stylesheet

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
      className="opponent-board-container" 
      data-active={isMyTurn}
    >
      {/* Username */}
      <h3 className="opponent-board-title">
        {board.username}
      </h3>

      {/* Opponent’s hand pile */}
      <div className="opponent-board-hand-row">
        <CardPile
          cards={board.hand}
          stackId="opponent-hand"
          layout="hand"
          faceDown
          draggable={false}
        />
      </div>

      {/* Personal + side piles row */}
      <div className="opponent-board-piles-row">
        {/* Personal pile */}
        <div className="opponent-board-personal-pile">
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

        {/* Side piles */}
        <div className="opponent-board-side-piles">
          {board.side.map((stack, index) => (
            <CardPile
              key={`side-${index}`}
              cards={stack}
              stackId={`opponent-side-${index + 1}`}
              layout="stack"
              offset={26}
              scatter
              draggable={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}