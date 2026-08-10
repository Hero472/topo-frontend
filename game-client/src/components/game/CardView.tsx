import { getCardImageUrl, getCardBackUrl } from "../../lib/cardAssets";
import type { Card } from "../../types/types";
import "./CardView.css";

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

const suitInfo: Record<Card["suit"], { symbol: string; color: string }> = {
  hearts: { symbol: "♥", color: "#c00" },
  diamonds: { symbol: "♦", color: "#c00" },
  clubs: { symbol: "♣", color: "#111" },
  spades: { symbol: "♠", color: "#111" },
};

const deckBackgrounds: Record<string, string> = {
  red: "#ffe0e0",
  blue: "#e0f0ff",
  black: "#e0e0e0",
  white: "#ffffff",
};

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


  if (imageUrl) {
    return (
      <span
        className={`card-view ${small ? "small" : ""} ${className ?? ""}`}
        style={style}
        draggable={false}
      >
        <img
          src={imageUrl}
          alt={
            showBack
              ? "Card back"
              : `${getDisplayValue(card.value)} of ${card.suit}`
          }
          loading="lazy"
          draggable={false}
        />
      </span>
    );
  }


  const suit = suitInfo[card.suit];
  const bg = deckBackgrounds[card.deck] ?? "#f8f8f8";


  return (
    <span
      className={`card-view fallback ${small ? "small" : ""} ${className ?? ""}`}
      style={{
        backgroundColor: showBack ? "#3a7bd5" : bg,
        ...style,
      }}
      draggable={false}
    >

      {showBack ? (

        <span className="card-back-symbol">
          🂠
        </span>

      ) : (

        <>
          <span className="corner top" style={{ color: suit.color }}>
            {getDisplayValue(card.value)}
            <br />
            {suit.symbol}
          </span>


          <span className="corner bottom" style={{ color: suit.color }}>
            {getDisplayValue(card.value)}
            <br />
            {suit.symbol}
          </span>


          <span
            className="center-suit"
            style={{
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