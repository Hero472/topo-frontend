import { useMemo } from "react";
import CardStack from "./CardStack";
import { ScaleManager } from "../game/ScaleManager";
import { useGameStore } from "../store/useGameStore";
import type { Card } from "../types/types";

export default function CenterArea() {
  const fullState = useGameStore((s) => s.fullState);
  const completedScaleIdx = useGameStore((s) => s.completedScaleIdx);
  const playCard = useGameStore((s) => s.playCard);

  // 8 scale arrays (Card[][])
  const commonStacks = useMemo(() => {
    if (!fullState) return Array(8).fill([]);
    return fullState.scales.map((s) => (s ? s.cards : []));
  }, [fullState]);

  // Dealer draw pile (top card face‑up, rest dummies)
  const dealerDrawPile = useMemo(() => {
    if (!fullState) return [];
    const { dealer_top, dealer_count } = fullState;
    if (dealer_count === 0 || !dealer_top) return [];

    // All cards are face‑down, so we only need the deck colour
    const pile: Card[] = Array.from({ length: dealer_count }, (_, i) => ({
        id: `dealer-${i}`,
        suit: "hearts",
        value: 0,
        deck: dealer_top,
    }));
    return pile;
    }, [fullState]);

  // Visible scale slots
  const firstEmptyIdx = commonStacks.findIndex((s) => s.length === 0);
  const visibleIndices: number[] = [];
  commonStacks.forEach((stack, i) => {
    if (stack.length > 0) visibleIndices.push(i);
  });
  if (firstEmptyIdx !== -1 && !visibleIndices.includes(firstEmptyIdx)) {
    visibleIndices.push(firstEmptyIdx);
  }
  visibleIndices.sort((a, b) => a - b);

  const handleDrop = (card: Card, sourceId: string, scaleIdx: number) => {
    const targetStack = commonStacks[scaleIdx];
    if (targetStack.length > 0 && ScaleManager.isScaleComplete(targetStack)) return;
    if (targetStack.length === 0) {
      const allowedIndex = ScaleManager.openScale(commonStacks, card);
      if (allowedIndex !== scaleIdx) return;
    } else {
      if (!ScaleManager.canPlaceOnScale(commonStacks, scaleIdx, card)) return;
    }
    playCard(card, sourceId, `center-${scaleIdx}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "12px",
        padding: "16px",
      }}
    >
      {/* Scale slots */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          flex: 1,
        }}
      >
        {visibleIndices.map((i) => (
          <div key={i} style={{ position: "relative" }}>
            <CardStack
              cards={commonStacks[i]}
              stackId={`center-${i}`}
              emptyLabel={commonStacks[i].length === 0 ? "A" : `${i + 1}`}
              draggable={true}
              onCardDrop={(card, sourceId) => handleDrop(card, sourceId, i)}
            />
            {completedScaleIdx === i && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0,0,0,0.85)",
                  color: "#ffd700",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1em",
                  zIndex: 10,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                ✅ Completed!
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dealer draw pile */}
      <div style={{ flexShrink: 0, marginLeft: "16px" }}>
        <CardStack
          cards={dealerDrawPile}
          stackId="center-draw"
          emptyLabel="Draw"
          draggable={false}
          faceDown
          onCardDrop={() => {}}
        />
      </div>
    </div>
  );
}