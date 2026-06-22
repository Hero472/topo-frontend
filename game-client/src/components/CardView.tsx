import type { Card, DeckColor } from "../types/types";

const suitInfo: Record<Card["suit"], { symbol: string; color: string }> = {
  hearts:   { symbol: "♥", color: "#c00" },
  diamonds: { symbol: "♦", color: "#c00" },
  clubs:    { symbol: "♣", color: "#111" },
  spades:   { symbol: "♠", color: "#111" },
};

const deckBackgrounds: Record<DeckColor, string> = {
  red:   "#ffe0e0",
  blue:  "#e0f0ff",
  black: "#e0e0e0",
  white: "#ffffff",
};

function getDisplayValue(value: number): string {
  if (value === 1)  return "A";
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  return value.toString();
}

export default function CardView({ card }: Readonly<{ card: Card }>) {
  const suit = suitInfo[card.suit];
  const bg = deckBackgrounds[card.deck] || "#f8f8f8";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "2.2em",
        height: "3em",
        padding: "0 6px",
        margin: "2px",
        backgroundColor: bg,
        border: "1px solid rgba(0,0,0,0.2)",
        borderRadius: 6,
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "1.1rem",
        fontWeight: 600,
        color: suit.color,
        cursor: "default",
        userSelect: "none",
        transition: "transform 0.1s ease, box-shadow 0.1s ease",
      }}
    >
      <span>{getDisplayValue(card.value)}</span>
      <span style={{ marginLeft: 2 }}>{suit.symbol}</span>
    </span>
  );
}
