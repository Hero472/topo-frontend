import { useEffect, useState } from "react";
import "./TurnTimer.css"; // Import the layout stylesheet

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

  // Compute a descriptive state string for clean CSS attribute styling
  const timerState = danger ? "danger" : isMyTurn ? "my-turn" : "opponent-turn";

  return (
    <div className="turn-timer-container" data-state={timerState}>
      <span className="turn-timer-label">
        {isMyTurn ? "🎯 Your Turn" : "⏳ Opponent Turn"}
      </span>
      <span className={`turn-timer-countdown ${danger ? "is-danger" : ""}`}>
        ⏳ {timeLeft}s
      </span>
    </div>
  );
}