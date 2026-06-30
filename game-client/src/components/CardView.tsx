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
}


export default function CardView({
  card,
  small = false,
  showBack = false,
  resolution = "x1"
}: Readonly<Props>) {
  
  const imageUrl = showBack
    ? getCardBackUrl(card.deck, resolution)
    : getCardImageUrl(card, resolution);

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    // Standard playing‑card ratio (2.5 : 3.5)
    width: small ? "3.5em" : "5em",
    height: small ? "4.9em" : "7em",
    borderRadius: small ? 4 : 6,
    backgroundColor: "#fff",
    border: "1px solid #aaa",
    boxShadow: small
      ? "none"
      : "0 2px 6px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
    overflow: "hidden",
    lineHeight: 1,
    userSelect: "none",
    position: "relative",
  };

  if (imageUrl) {
    return (
      <span style={containerStyle}>
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
    boxShadow: small
      ? "none"
      : "0 1px 3px rgba(0,0,0,0.15)",
  };

  return (
    <span style={fallbackContainerStyle}>
      {showBack ? (
        <span
          style={{
            color: "#fff",
            fontSize: small ? "0.8rem" : "1.2rem",
            fontWeight: "bold",
          }}
        >
          🂠
        </span>
      ) : (
        <>
          {/* Top‑left index */}
          <span
            style={{
              position: "absolute",
              top: 2,
              left: 4,
              fontSize: small ? "0.5rem" : "0.7rem",
              fontWeight: "bold",
              color: suit.color,
              lineHeight: 1,
            }}
          >
            {getDisplayValue(card.value)}
            <br />
            {suit.symbol}
          </span>

          {/* Bottom‑right index (rotated 180°) */}
          <span
            style={{
              position: "absolute",
              bottom: 2,
              right: 4,
              fontSize: small ? "0.5rem" : "0.7rem",
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

          {/* Large centre symbol */}
          <span
            style={{
              fontSize: small ? "1.5rem" : "2.5rem",
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