import { useEffect, useState } from 'react';

export default function TurnTimer({ initialSeconds }: Readonly<{ initialSeconds: number }>) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>⏳ Your turn – {timeLeft}s left</span>;
}