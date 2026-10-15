import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface Props {
  initialSeconds: number;
  isMyTurn: boolean;
}

export default function TurnTimer({ initialSeconds, isMyTurn }: Readonly<Props>) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!isMyTurn) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(initialSeconds);

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isMyTurn, initialSeconds]);

  const danger = timeLeft <= 5 && timeLeft > 0;
  const progressPercent = initialSeconds > 0 ? (timeLeft / initialSeconds) * 100 : 0;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 w-full max-w-[200px] p-3 rounded-xl border transition-all duration-300",
        isMyTurn 
          ? "bg-background-secondary border-brand-primary/30 shadow-lg shadow-brand-primary/10" 
          : "bg-background-tertiary/50 border-border-primary"
      )}
    >
      {/* Header: Label + Countdown */}
      <div className="flex items-center justify-between w-full px-1">
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wider transition-colors duration-300",
            danger 
              ? "text-state-error animate-pulse" 
              : isMyTurn 
              ? "text-brand-primary" 
              : "text-foreground-tertiary"
          )}
        >
          {isMyTurn ? "Your Turn" : "Opponent's Turn"}
        </span>
        
        {isMyTurn && timeLeft > 0 && (
          <span
            className={cn(
              "text-sm font-mono font-semibold tabular-nums transition-colors duration-300",
              danger ? "text-state-error animate-pulse" : "text-foreground-primary"
            )}
          >
            {timeLeft}s
          </span>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-2.5 sm:h-3 rounded-full overflow-hidden bg-background-tertiary border border-border-primary/50 shadow-inner">
        {/* Progress Bar Fill */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            danger 
              ? "bg-state-error" 
              : isMyTurn 
              ? "bg-brand-primary" 
              : "bg-foreground-quaternary"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}