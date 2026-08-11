import { useEffect, useMemo, useState } from "react";

export function useResendCooldown(seconds: number) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [remainingSeconds]);

  const formattedRemaining = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const secondsPart = remainingSeconds % 60;
    return `${minutes}:${secondsPart.toString().padStart(2, "0")}`;
  }, [remainingSeconds]);

  return {
    remainingSeconds,
    isCoolingDown: remainingSeconds > 0,
    formattedRemaining,
    startCooldown: () => setRemainingSeconds(seconds),
  };
}
