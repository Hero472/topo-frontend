import { getCardImageUrl, getCardBackUrl } from "../lib/cardAssets";
import type { Card } from "../types/types";

const suitInfo: Record<Card["suit"], { symbol: string; color: string }> = {
  hearts:   { symbol: "♥", color: "#c00" },
  diamonds: { symbol: "♦", color: "#c00" },
  clubs:    { symbol: "♣", color: "#111" },
  spades:   { symbol: "♠", color: "#111" },
};

function getDisplayValue(value: number): string {
  if (value === 1)  return "A";
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  return value.toString();
}

interface Props {
  card: Card;
  small?: boolean;
  showBack?: boolean;
  resolution?: "x1" | "x2";
  className?: string;
  style?: React.CSSProperties;
}

export default function CardView({
  card,
  small = false,
  showBack = false,
  resolution = "x1",
  className,
  style,
}: Readonly<Props>) {
  const imageUrl = showBack
    ? getCardBackUrl(card.deck, resolution)
    : getCardImageUrl(card, resolution);

  // Card dimensions in em, driven by the root font size
  const cardWidth = small ? "4em" : "6em";
  const cardHeight = small ? "5.6em" : "8.4em";

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: cardWidth,
    height: cardHeight,
    borderRadius: small ? "0.25em" : "0.4em",
    backgroundColor: "#fff",
    border: "1px solid #aaa",
    boxShadow: small
      ? "none"
      : "0 2px 6px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
    overflow: "hidden",
    lineHeight: 1,
    userSelect: "none",
    position: "relative" as const,
    fontSize: small ? "0.7em" : "1em",   // smaller cards get a smaller font
    ...style,
  };

  if (imageUrl) {
    return (
      <span className={className} style={containerStyle}>
        <img
          src={imageUrl}
          alt={
            showBack
              ? "Card back"
              : `${getDisplayValue(card.value)} of ${card.suit}`
          }
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </span>
    );
  }

  const suit = suitInfo[card.suit];

  const deckBackgrounds: Record<string, string> = {
    red:   "#ffe0e0",
    blue:  "#e0f0ff",
    black: "#e0e0e0",
    white: "#ffffff",
  };
  const bg = deckBackgrounds[card.deck] || "#f8f8f8";

  const fallbackContainerStyle: React.CSSProperties = {
    ...containerStyle,
    backgroundColor: showBack ? "#3a7bd5" : bg,
    border: "1px solid rgba(0,0,0,0.2)",
    boxShadow: small ? "none" : "0 1px 3px rgba(0,0,0,0.15)",
  };

  return (
    <span className={className} style={fallbackContainerStyle}>
      {showBack ? (
        <span
          style={{
            color: "#fff",
            fontSize: "1.2em",
            fontWeight: "bold",
          }}
        >
          🂠
        </span>
      ) : (
        <>
          <span
            style={{
              position: "absolute",
              top: "0.15em",
              left: "0.3em",
              fontSize: "0.7em",
              fontWeight: "bold",
              color: suit.color,
              lineHeight: 1,
            }}
          >
            {getDisplayValue(card.value)}
            <br />
            {suit.symbol}
          </span>
          <span
            style={{
              position: "absolute",
              bottom: "0.15em",
              right: "0.3em",
              fontSize: "0.7em",
              fontWeight: "bold",
              color: suit.color,
              transform: "rotate(180deg)",
              lineHeight: 1,
            }}
          >
            {getDisplayValue(card.value)}
            <br />
            {suit.symbol}
          </span>
          <span
            style={{
              fontSize: "2.5em",
              color: suit.color,
            }}
          >
            {suit.symbol}
          </span>
        </>
      )}
    </span>
  );
}