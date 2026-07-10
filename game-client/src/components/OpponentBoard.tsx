import CardPile from "./CardPile";
import type { OpponentBoard as OpponentBoardType } from "../types/types";

interface Props {
  board: OpponentBoardType;
}

export default function OpponentBoard({
  board,
}: Readonly<Props>) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <h3>{board.username}</h3>


      {/* Opponent hand */}
      <CardPile
        cards={[]}
        stackId="opponent-hand"
        layout="hand"
        faceDown
        count={board.hand_count}
        draggable={false}
        emptyLabel={
          board.hand_count === 0
            ? "No cards"
            : ""
        }
      />


      {/* Opponent side piles */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
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


      {/* Opponent personal pile */}
      <CardPile
        cards={
          board.personal_top
            ? [board.personal_top]
            : []
        }
        stackId="opponent-personal"
        layout="stack"
        scatter
        showOnlyTopFace
        count={board.personal_count}
        draggable={false}
      />
    </section>
  );
}