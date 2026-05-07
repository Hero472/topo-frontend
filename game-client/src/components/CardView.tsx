import type { Card } from "../types";

const suitSymbols = ["♠", "♥", "♦", "♣"];
const suitColors = ["#000", "#c00", "#c00", "#000"];

export default function CardView({ card }: Readonly<{ card: Card }>) {
  const symbol = suitSymbols[card.suit] ?? "?";
  const color = suitColors[card.suit] ?? "#000";
  return (
    <span style={{ color, fontWeight: "bold", marginRight: 4 }}>
      {card.rank}{symbol}
    </span>
  );
}