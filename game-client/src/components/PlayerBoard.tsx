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
  // Fluid measurements – scale with viewport, not container
  const gap = "clamp(0.25rem, 1vw, 0.75rem)";
  const padding = "clamp(0.25rem, 1vw, 0.5rem)";
  const sideGap = "clamp(0.1rem, 0.5vw, 0.25rem)";
  const borderRadius = "clamp(6px, 1.5vw, 12px)";
  const titleFontSize = "clamp(0.8rem, 2.5vw, 1.5rem)";

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        height: "100%",
        minWidth: 0,
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
      {/* Row: Side piles + Personal pile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minWidth: 0,
          gap,
          overflow: "hidden",
          flexShrink: 1,
        }}
      >
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
              stackId={`side-${index + 1}`}
              layout="stack"
              offset={8}
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
            draggable={isMyTurn}
            onCardDrop={onDrop}
          />
        </div>
      </div>

      {/* Hand row */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          minWidth: 0,
          overflow: "hidden",
          flexShrink: 1,
        }}
      >
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
        You
      </h3>
    </section>
  );
}