import { useCallback, useEffect, useState } from "react";

export function formatExamTimer(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type UseExamTimerOptions = {
  initialSeconds: number;
  onExpire?: () => void;
  active?: boolean;
};

export function useExamTimer({ initialSeconds, onExpire, active = true }: UseExamTimerOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!active || remainingSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [active, onExpire]);

  const setSeconds = useCallback((seconds: number) => {
    setRemainingSeconds(Math.max(0, seconds));
  }, []);

  return {
    remainingSeconds,
    setRemainingSeconds: setSeconds,
    timerLabel: formatExamTimer(remainingSeconds),
    isExpired: remainingSeconds <= 0,
  };
}
