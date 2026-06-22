import { useEffect, useState, useRef } from "react";

interface Props {
  initialSeconds: number;
}

export default function TurnTimer({ initialSeconds }: Readonly<Props>) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // runs once on mount – no sync needed

  return <span>⏳ Your turn – {timeLeft}s left</span>;
}