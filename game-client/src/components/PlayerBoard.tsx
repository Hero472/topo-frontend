import CardPile from "./CardPile";
import type { PlayerBoard as PlayerBoardType } from "../types/types";
import type { CardDropEvent } from "../hooks/useDropTarget";

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
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem", // was 1rem
        border: isMyTurn ? "3px solid #4CAF50" : "3px solid transparent",
        borderRadius: 12,
        padding: "1.5rem",
        opacity: isMyTurn ? 1 : 0.7,
        transition: "all 150ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          width: "100%",
        }}
      >
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
              stackId={`side-${index + 1}`}
              layout="stack"
              offset={16}
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

        <div style={{ margin: "1rem" }}>
          <CardPile
            cards={board.personal.top ? [board.personal.top] : []}
            stackId="personal"
            layout="stack"
            scatter
            showOnlyTopFace
            count={board.personal.count}
            draggable={isMyTurn}
            onCardDrop={onDrop}
          />
        </div>
      </div>

      <CardPile
        cards={board.hand}
        stackId="hand"
        layout="hand"
        overlap={1.5}
        draggable={isMyTurn}
        onCardDrop={onDrop}
        allowedSourceIds={["draw"]}
      />

      <h3>You</h3>
    </section>
  );
}