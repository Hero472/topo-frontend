import CardPile from "./CardPile";
import type { Card, OpponentBoard as OpponentBoardType } from "../../types/types";
import "./OpponentBoard.css"; // Import the layout stylesheet

interface Props {
  board: OpponentBoardType;
  isMyTurn: boolean;
}

function createHiddenCards(count: number): Card[] {
  return Array.from({ length: count }, (_, i) => ({
    suit: "spades",
    value: (i % 13) + 1,
    deck: "red",
  }));
}

export default function OpponentBoard({
  board,
  isMyTurn,
}: Readonly<Props>) {
  const opponentCards = createHiddenCards(board.hand_count);

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
          cards={opponentCards}
          stackId="opponent-hand"
          layout="hand"
          faceDown
          count={board.hand_count}
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