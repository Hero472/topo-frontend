import { getCardImageUrl, getCardBackUrl } from "../../lib/cardAssets";
import type { Card } from "../../types/types";

interface Props {
  card: Card;
  small?: boolean;
  showBack?: boolean;
  resolution?: "x1" | "x2";
  className?: string;
  style?: React.CSSProperties;
}

function getDisplayValue(value: number): string {
  if (value === 1) return "A";
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  return value.toString();
}

const suitInfo: Record<Card["suit"], { symbol: string; colorClass: string }> = {
  hearts: { symbol: "♥", colorClass: "text-red-600 dark:text-red-500" },
  diamonds: { symbol: "♦", colorClass: "text-red-600 dark:text-red-500" },
  clubs: { symbol: "♣", colorClass: "text-foreground-primary" },
  spades: { symbol: "♠", colorClass: "text-foreground-primary" },
};

const deckBackgrounds: Record<string, string> = {
  red: "bg-red-50 dark:bg-red-950",
  blue: "bg-blue-50 dark:bg-blue-950",
  black: "bg-gray-100 dark:bg-gray-800",
  white: "bg-white dark:bg-gray-900",
};

export default function CardView({
  card,
  small = false,
  showBack = false,
  resolution = "x1",
  className = "",
  style,
}: Readonly<Props>) {
  const imageUrl = showBack
    ? getCardBackUrl(card.deck, resolution)
    : getCardImageUrl(card, resolution);

  const suit = suitInfo[card.suit];
  const bgClass = deckBackgrounds[card.deck] ?? "bg-gray-50 dark:bg-gray-900";
  
  // ✅ COMPACT SIZING: Perfect for fitting 4-5 cards horizontally on mobile
  const sizeClasses = small 
    ? "w-14 sm:w-16 md:w-20"       // 56px -> 64px -> 80px
    : "w-16 sm:w-20 md:w-24 lg:w-28"; // 64px -> 80px -> 96px -> 112px

  if (imageUrl) {
    return (
      <span
        className={`relative block ${sizeClasses} aspect-[5/7] rounded-xl shadow-lg select-none touch-none ${className}`}
        style={style}
        draggable={false}
      >
        <img
          src={imageUrl}
          alt={showBack ? "Card back" : `${getDisplayValue(card.value)} of ${card.suit}`}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-contain rounded-xl pointer-events-none"
        />
      </span>
    );
  }

  // ✅ FALLBACK RENDERING (Adjusted font sizes to match new smaller widths)
  return (
    <span
      className={`relative block ${sizeClasses} aspect-[5/7] rounded-xl shadow-lg border border-border-primary select-none touch-none ${bgClass} ${className}`}
      style={style}
      draggable={false}
    >
      {showBack ? (
        <span className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl text-blue-800 dark:text-blue-400">
          🂠
        </span>
      ) : (
        <>
          <span className={`absolute top-1 left-1 text-[9px] sm:text-[10px] font-bold leading-none ${suit.colorClass}`}>
            {getDisplayValue(card.value)}<br />{suit.symbol}
          </span>
          <span className={`absolute bottom-1 right-1 text-[9px] sm:text-[10px] font-bold leading-none rotate-180 ${suit.colorClass}`}>
            {getDisplayValue(card.value)}<br />{suit.symbol}
          </span>
          <span className={`absolute inset-0 flex items-center justify-center text-xl sm:text-3xl ${suit.colorClass}`}>
            {suit.symbol}
          </span>
        </>
      )}
    </span>
  );
}