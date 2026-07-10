import CardPile from "./CardPile";
import type { PlayerBoard as PlayerBoardType } from "../types/types";
import type { CardDropEvent } from "../hooks/useDropTarget";

interface Props {
  board: PlayerBoardType;
  onDrop: (event: CardDropEvent) => void;
}

export default function PlayerBoard({
  board,
  onDrop,
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
      <h3>You</h3>

      {/* Hand */}
      <div>
        <CardPile
          cards={board.hand}
          stackId="hand"
          layout="hand"
          faceDown={false}
          overlap={1.5}
          onCardDrop={onDrop}
          allowedSourceIds={["draw"]}
        />
      </div>


      {/* Side piles */}
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
            stackId={`side-${index + 1}`}
            layout="stack"
            offset={16}
            scatter
            onCardDrop={onDrop}
            allowedSourceIds={[
              "hand",
              "personal",
              `side-${index + 1}`,
            ]}
          />
        ))}
      </div>


      {/* Personal pile */}
      <div>
        <CardPile
          cards={
            board.personal.top
              ? [board.personal.top]
              : []
          }
          stackId="personal"
          layout="stack"
          scatter
          showOnlyTopFace
          count={board.personal.count}
          onCardDrop={onDrop}
        />
      </div>
    </section>
  );
}