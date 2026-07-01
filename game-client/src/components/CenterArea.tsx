import CardStack from "./CardStack";
import { ScaleManager } from "../game/ScaleManager";
import type { Card } from "../types/types";

interface Props {
  stacks: Card[][];
  onCardDrop: (
    card: Card,
    sourceStackId: string,
    targetStackId: string,
  ) => void;
}

export default function CenterArea({ stacks, onCardDrop }: Props) {
  const handleDrop = (card: Card, sourceId: string, scaleIdx: number) => {
    const targetStack = stacks[scaleIdx];

    if (targetStack.length === 0) {
      // Only allow opening a scale if it's the first available slot and the card is an Ace
      const allowedIndex = ScaleManager.openScale(stacks, card);
      if (allowedIndex !== scaleIdx) return;
    } else {
      // Non‑empty – validate using the new King‑as‑joker rules (no consecutive Kings)
      if (!ScaleManager.canPlaceOnScale(stacks, scaleIdx, card)) return;
    }

    // Drop is valid
    onCardDrop(card, sourceId, `center-${scaleIdx}`);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "8px",
        justifyItems: "center",
        alignItems: "center",
        padding: "16px",
      }}
    >
      {stacks.map((stack, i) => (
        <CardStack
          key={i}
          cards={stack}
          stackId={`center-${i}`}
          emptyLabel={`${i + 1}`}
          draggable={true}
          onCardDrop={(card, sourceId) => handleDrop(card, sourceId, i)}
        />
      ))}
    </div>
  );
}
