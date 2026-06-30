import CardView from "./CardView";
import type { Card } from "../types/types";

interface Props {
  cards: Card[];
  small?: boolean;
  resolution?: "x1" | "x2";
  emptyLabel?: string;
  offsetY?: number;
  showOnlyTopFace?: boolean;
  faceDown?: boolean;
  scatter?: boolean;
  scatterMaxRotation?: number;
  scatterMaxTranslate?: number;
}

export default function CardScale({
  cards,
  small = false,
  resolution = "x1",
  emptyLabel = "",
  offsetY = 16,
  showOnlyTopFace = false,
  faceDown = false,
  scatter = true,
  scatterMaxRotation = 2,
  scatterMaxTranslate = 2
}: Readonly<Props>) {

  const cardHeight = small ? "4.9em" : "7em";
  const cardWidth = small ? "3.5em" : "5em";
  const stackDepth = cards.length;

  const buildShadow = (depth: number): string => {
    if (depth <= 1) {
      return "0 1px 3px rgba(0,0,0,0.15)";
    }
    const cappedDepth = Math.min(depth, 10);
    const layers: string[] = [];
    for (let i = 0; i <= cappedDepth; i++) {
      const y = i * 0.8;
      const blur = 1 + i * 0.5;
      const alpha = 0.15 - i * 0.01;
      layers.push(`0 ${y}px ${blur}px rgba(0,0,0,${alpha.toFixed(2)})`);
    }
    layers.push("0 0 0 1px rgba(0,0,0,0.05)");
    return layers.join(", ");
  };

  function getScatterTransform(index: number, card: Card): string {
    if (!scatter) return "none";

    const seed = (index * 137 + card.value * 53 + card.suit.length * 17) % 1000;
    const pseudo = Math.sin(seed) * 10000;
    const rnd = pseudo - Math.floor(pseudo); // 0..1

    const rotation = (rnd * 2 - 1) * scatterMaxRotation;
    const dx = ((Math.sin(seed + 1) * 10000) % 1 * 2 - 1) * scatterMaxTranslate;
    const dy = ((Math.sin(seed + 2) * 10000) % 1 * 2 - 1) * scatterMaxTranslate;

    return `rotate(${rotation}deg) translate(${dx}px, ${dy}px)`;
  }

  // Badge configuration
  const showBadge = stackDepth > 1 && offsetY === 0;
  const badgeSize = small ? "1.2em" : "1.5em";
  const badgeFontSize = small ? "0.6rem" : "0.75rem";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: cardWidth,
        height:
          stackDepth > 0
            ? `calc(${cardHeight} + ${(stackDepth - 1) * offsetY}px)`
            : cardHeight,
        boxShadow: buildShadow(stackDepth),
        borderRadius: small ? "4px" : "6px",
        backgroundColor: "transparent",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {stackDepth === 0 && emptyLabel ? (
        <span
          style={{
            color: "#999",
            padding: "0 8px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {emptyLabel}
        </span>
      ) : (
        <>
          {showBadge && (
            <div
              title={`${stackDepth} card${stackDepth !== 1 ? "s" : ""}`}
              style={{
                position: "absolute",
                bottom: small ? 2 : 4,
                right: small ? 2 : 4,
                zIndex: stackDepth + 1,
                backgroundColor: "rgba(0,0,0,0.75)",
                color: "#fff",
                borderRadius: "50%",
                width: badgeSize,
                height: badgeSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: badgeFontSize,
                fontWeight: "bold",
                lineHeight: 1,
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                userSelect: "none",
              }}
            >
              {stackDepth}
            </div>
          )}

          {cards.map((card, index) => {
            const isTop = index === stackDepth - 1;
            const showBack =  faceDown || showOnlyTopFace && !isTop;
            const transform = getScatterTransform(index, card);

            return (
              <div
                key={`${card.suit}-${card.value}-${index}`}
                style={{
                  position: "absolute",
                  top: index * offsetY,
                  left: 0,
                  zIndex: index,
                  transform,
                }}
              >
                <CardView
                  card={card}
                  small={small}
                  resolution={resolution}
                  showBack={showBack}
                  // deckColor is automatically taken from card.deck via CardView
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}