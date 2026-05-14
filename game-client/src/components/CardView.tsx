import type { Card } from "../types";

const suitMap: Record<string, { symbol: string; color: string }> = {
  hearts:   { symbol: "♥", color: "#c00" },
  diamonds: { symbol: "♦", color: "#c00" },
  clubs:    { symbol: "♣", color: "#000" },
  spades:   { symbol: "♠", color: "#000" },
};

export default function CardView({ card }: Readonly<{ card: Card }>) {
  const info = suitMap[card.suit.toLowerCase()] ?? { symbol: "?", color: "#000" };

  let displayValue: string | number;
  switch (card.value) {
    case 1:
      displayValue = "A";
      break;
    case 11:
      displayValue = "J";
      break;
    case 12:
      displayValue = "Q";
      break;
    case 13:
      displayValue = "K";
      break;
    default:
      displayValue = card.value;
  }

  return (
    <span
      style={{
        color: info.color,
        fontWeight: "bold",
        marginRight: 4,
        background: card.deck === "blue" ? "#e0f0ff" : card.deck === "red" ? "#ffe0e0" : "transparent",
        padding: "0 2px",
        borderRadius: 3,
      }}
    >
      {displayValue}{info.symbol}
    </span>
  );
}