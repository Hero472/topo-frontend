import type { Card } from "../types";

// Map suit strings → { symbol, colour }
const suitMap: Record<string, { symbol: string; color: string }> = {
  hearts:   { symbol: "♥", color: "#c00" },
  diamonds: { symbol: "♦", color: "#c00" },
  clubs:    { symbol: "♣", color: "#000" },
  spades:   { symbol: "♠", color: "#000" },
};

export default function CardView({ card }: Readonly<{ card: Card }>) {
  const info = suitMap[card.suit.toLowerCase()] ?? { symbol: "?", color: "#000" };
  return (
    <span
      style={{
        color: info.color,
        fontWeight: "bold",
        marginRight: 4,
        // optional background tint from deck ("blue"/"red")
        background: card.deck === "blue" ? "#e0f0ff" : card.deck === "red" ? "#ffe0e0" : "transparent",
        padding: "0 2px",
        borderRadius: 3,
      }}
    >
      {card.value}{info.symbol}
    </span>
  );
}