import { useEffect, useState } from "react";
import "./TurnTimer.css";

interface Props {
  initialSeconds: number;
  isMyTurn: boolean;
}

export default function TurnTimer({ initialSeconds, isMyTurn }: Readonly<Props>) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  // Reset the timer whenever the turn changes or the initial duration updates
  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [initialSeconds, isMyTurn]);

  useEffect(() => {
    // Only count down if it's the active player's turn and time remains
    if (!isMyTurn || timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [isMyTurn, timeLeft]);

  const danger = timeLeft <= 5;
  const timerState = danger ? "danger" : isMyTurn ? "my-turn" : "opponent-turn";

  return (
    <div className="turn-timer-container" data-state={timerState}>
      <div className="turn-timer-content">
        <span className="turn-timer-label">
          {isMyTurn ? "Your Turn" : "Opponent's Turn"}
        </span>
        <span className={`turn-timer-countdown ${danger ? "is-danger" : ""}`}>
          {timeLeft}s
        </span>
      </div>
      
      {/* Visual progress bar that depletes as time runs out */}
      <div 
        className="turn-timer-progress" 
        style={{ width: `${(timeLeft / initialSeconds) * 100}%` }} 
      />
    </div>
  );
}