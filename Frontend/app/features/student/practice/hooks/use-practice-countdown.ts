import { useCallback, useEffect, useRef, useState } from "react";

type UsePracticeCountdownOptions = {
  totalSeconds: number;
  active: boolean;
  onComplete: () => void;
};

export function usePracticeCountdown({
  totalSeconds,
  active,
  onComplete,
}: UsePracticeCountdownOptions) {
  const [remainingMs, setRemainingMs] = useState(totalSeconds * 1000);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const reset = useCallback(() => {
    setRemainingMs(totalSeconds * 1000);
  }, [totalSeconds]);

  useEffect(() => {
    if (!active) {
      reset();
      return;
    }

    reset();
    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextRemaining = Math.max(totalSeconds * 1000 - elapsed, 0);
      setRemainingMs(nextRemaining);

      if (nextRemaining <= 0) {
        window.clearInterval(intervalId);
        onCompleteRef.current();
      }
    }, 50);

    return () => window.clearInterval(intervalId);
  }, [active, reset, totalSeconds]);

  const progressPercent =
    totalSeconds <= 0 ? 0 : (remainingMs / (totalSeconds * 1000)) * 100;

  return {
    remainingMs,
    progressPercent,
    reset,
  };
}
