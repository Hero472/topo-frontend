import CardHand from "./CardHand";
import CardStack from "./CardStack";
import type { Card } from "../types/types";

interface Props {
  playerId: string;
  rotated?: boolean;
  hand: Card[];
  personalStacks: Card[][];
  rightStack: Card[];
  onCardDrop: (card: Card, sourceStackId: string, targetStackId: string) => void;
}

export default function PlayerBoard({
  playerId,
  rotated = false,
  hand,
  personalStacks,
  rightStack,
  onCardDrop,
}: Readonly<Props>) {
    
  const makeDropHandler =
    (targetId: string) => (card: Card, sourceId: string) => {
      onCardDrop(card, sourceId, targetId);
    };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        transform: rotated ? "rotate(180deg)" : "none",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <div />

        {/* Center: personal stacks */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          {personalStacks.map((stack, i) => (
            <CardStack
              key={i}
              cards={stack}
              stackId={`personal-${playerId}-${i}`}
              emptyLabel="P"
              draggable={!rotated}
              faceDown={rotated}
              onCardDrop={makeDropHandler(`personal-${playerId}-${i}`)}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "24px",
          }}
        >
          <CardStack
            cards={rightStack}
            stackId={`right-${playerId}`}
            emptyLabel="R"
            draggable={!rotated}
            faceDown={rotated}
            onCardDrop={makeDropHandler(`right-${playerId}`)}
          />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "12px",
        }}
      >
        <CardHand
          cards={hand}
          stackId={`hand-${playerId}`}
          draggable={!rotated}
          faceDown={rotated}
          small={false}
          onCardDrop={makeDropHandler(`hand-${playerId}`)}
        />
      </div>
    </div>
  );
}