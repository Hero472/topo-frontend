import { useMemo, useRef } from "react";
import CardHand from "./CardHand";
import CardStack from "./CardStack";
import { useGameStore } from "../store/useGameStore";
import type { Card } from "../types/types";

interface Props {
  playerId: "current" | "opponent";
  rotated?: boolean;
}

export default function PlayerBoard({ playerId, rotated = false }: Props) {
  const fullState = useGameStore((s) => s.fullState);
  const isCurrent = playerId === "current";

  // Store action methods
  const moveToSide = useGameStore((s) => s.moveToSide);
  const movePersonalToSide = useGameStore((s) => s.movePersonalToSide);

  const draggedHandIndex = useRef<number | null>(null);

  const hand = useMemo(() => {
    if (!fullState) return [];
    if (isCurrent) return fullState.your_board.hand;
    return Array.from({ length: fullState.opponent.hand_count }, (_, i) => ({
      id: `opp-hand-${i}`,
      suit: "hearts",
      value: 0,
      deck: "blue",
    } as Card));
  }, [fullState, isCurrent]);

  const personalStacks = useMemo(() => {
    if (!fullState) return [[], [], [], []] as Card[][];
    return isCurrent ? fullState.your_board.side : fullState.opponent.side;
  }, [fullState, isCurrent]);

  const rightStack: Card[] = [];

  const handleHandDragStart = (card: Card, _sourceStackId: string) => {
    const idx = hand.indexOf(card);
    if (idx !== -1) {
      draggedHandIndex.current = idx;
    }
  };

  const handleDragEnd = () => {
    draggedHandIndex.current = null;
  };

  const makeSideDropHandler = (stackIdx: number) =>
    (_card: Card, sourceId: string) => {
      if (!isCurrent) return;

      if (sourceId === "hand-current" && draggedHandIndex.current !== null) {
        moveToSide(draggedHandIndex.current, stackIdx);
      } else if (sourceId.startsWith("personal-current")) {
        movePersonalToSide(stackIdx);
      }
    };

  const rightStackHandler = (_card: Card, _sourceId: string) => {
    // Placeholder – implement if needed
  };

  const handDropHandler = (_card: Card, _sourceId: string) => {
    // No-op
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
      {/* Top row: personal stacks + right stack */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <div />
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          {personalStacks.map((stack, i) => (
            <CardStack
              key={i}
              cards={stack}
              stackId={`personal-${playerId}-${i}`}
              emptyLabel="P"
              draggable={isCurrent}
              faceDown={!isCurrent}
              onCardDrop={makeSideDropHandler(i)}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "24px" }}>
          <CardStack
            cards={rightStack}
            stackId={`right-${playerId}`}
            emptyLabel="R"
            draggable={isCurrent}
            faceDown={!isCurrent}
            onCardDrop={rightStackHandler}
          />
        </div>
      </div>

      {/* Bottom row: hand */}
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
          draggable={isCurrent}
          faceDown={!isCurrent}
          small={false}
          onCardDrop={handDropHandler}
          onDragStartCard={handleHandDragStart}
          onDragEndCard={handleDragEnd}
        />
      </div>
    </div>
  );
}