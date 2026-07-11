import CardPile from "./CardPile";
import type { Card, OpponentBoard as OpponentBoardType } from "../types/types";

interface Props {
  board: OpponentBoardType;
  isMyTurn: boolean;
}

export default function OpponentBoard({
  board,
  isMyTurn,
}: Readonly<Props>) {
  // Fluid spacing scales with viewport width (like PlayerBoard)
  const gap = "clamp(0.25rem, 1vw, 0.75rem)";
  const padding = "clamp(0.25rem, 1vw, 0.75rem)";
  const sideGap = "clamp(0.125rem, 0.5vw, 0.25rem)";
  const borderRadius = "clamp(6px, 1.5vw, 12px)";
  const titleFontSize = "clamp(0.8rem, 2.5vw, 1.5rem)";

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
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        height: "100%",
        minHeight: 0,
        gap,
        padding,
        border: isMyTurn ? "3px solid #4CAF50" : "3px solid transparent",
        borderRadius,
        opacity: isMyTurn ? 1 : 0.7,
        transition: "all 150ms ease",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Username – now scales with viewport */}
      <h3
        style={{
          margin: 0,
          fontSize: titleFontSize,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {board.username}
      </h3>

      {/* Opponent’s hand pile */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          minWidth: 0,
        }}
      >
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap,
          width: "100%",
          minWidth: 0,
        }}
      >
        {/* Personal pile */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            minWidth: 0,
            flexShrink: 1,
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
        </div>

        {/* Side piles */}
        <div
          style={{
            display: "flex",
            gap: sideGap,
            minWidth: 0,
            flexShrink: 1,
            overflow: "hidden",
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