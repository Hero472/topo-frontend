import { useEffect, useState } from "react";

interface Props {
  initialSeconds: number;
  isMyTurn?: boolean;
}

export default function TurnTimer({ initialSeconds, isMyTurn = true }: Readonly<Props>) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const danger = timeLeft <= 5;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: "clamp(280px, 90vw, 500px)",
      padding: "clamp(0.4rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.25rem)",
      borderRadius: "clamp(6px, 1.5vw, 12px)",
      background: "#20242a",
      border: `2px solid ${danger ? "#d32f2f" : isMyTurn ? "#4CAF50" : "#555"}`,
      color: "white",
      fontWeight: 600,
      boxSizing: "border-box",
      gap: "clamp(0.25rem, 1vw, 0.5rem)",
      transition: "all 150ms ease",
    }}>
      <span style={{
        display: "flex",
        alignItems: "center",
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: "clamp(0.75rem, 2.5vw, 1rem)",
      }}>
        {isMyTurn ? "🎯 Your Turn" : "⏳ Opponent Turn"}
      </span>
      <span style={{
        flexShrink: 0,
        fontSize: "clamp(0.9rem, 3.5vw, 1.1rem)",
        fontVariantNumeric: "tabular-nums",
        color: danger ? "#ff5252" : "white",
      }}>
        ⏳ {timeLeft}s
      </span>
    </div>
  );
}