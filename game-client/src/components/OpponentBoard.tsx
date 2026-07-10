import CardPile from "./CardPile";
import type { Card, OpponentBoard as OpponentBoardType } from "../types/types";

interface Props {
  board: OpponentBoardType;
  isMyTurn: boolean
}

export default function OpponentBoard({
  board,
  isMyTurn
}: Readonly<Props>) {

  const opponentCards: Card[] = Array.from(
    { length: board.hand_count },
    (_, i) => ({
      suit: "spades",
      value: (i % 13) + 1,
      deck: "red",
    })
  );

  return (
    <section
      style={{
        border: isMyTurn ? "3px solid #4CAF50" : "3px solid transparent",
        borderRadius: 12,
        padding: "1rem",
        opacity: isMyTurn ? 1 : 0.7,
        transition: "all 150ms ease",
      }}
    >
      <h3>{board.username}</h3>

      <CardPile
        cards={opponentCards}
        stackId="opponent-hand"
        layout="hand"
        faceDown
        count={board.hand_count}
        draggable={false}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          width: "100%",
        }}
      >
        <CardPile
          cards={board.personal_top ? [board.personal_top] : []}
          stackId="opponent-personal"
          layout="stack"
          scatter
          showOnlyTopFace
          count={board.personal_count}
          draggable={false}
        />

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
          }}
        >
          {board.side.map((stack, index) => (
            <CardPile
              key={index}
              cards={stack}
              stackId={`opponent-side-${index + 1}`}
              layout="stack"
              offset={16}
              scatter
              draggable={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}