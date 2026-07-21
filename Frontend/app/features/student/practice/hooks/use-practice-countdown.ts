import { useEffect, useRef, useState } from "react";

type UsePracticeCountdownOptions = {
  totalSeconds: number;
  active: boolean;
  onComplete: () => void;
};

/**
 * Countdown for auto-advance. Completion uses a single timeout + guard so
 * React Strict Mode remounts and progress ticks cannot fire onComplete twice.
 */
export function usePracticeCountdown({
  totalSeconds,
  active,
  onComplete,
}: UsePracticeCountdownOptions) {
  const safeTotalSeconds = Number.isFinite(totalSeconds) ? Math.max(totalSeconds, 0) : 0;
  const durationMs = safeTotalSeconds * 1000;
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      completedRef.current = false;
      setRemainingMs(durationMs);
      return;
    }

    completedRef.current = false;
    const startedAt = Date.now();
    setRemainingMs(durationMs);

    const finish = () => {
      if (completedRef.current) {
        return;
      }
      completedRef.current = true;
      setRemainingMs(0);
      onCompleteRef.current();
    };

    if (durationMs <= 0) {
      const immediateId = window.setTimeout(finish, 0);
      return () => window.clearTimeout(immediateId);
    }

    const timeoutId = window.setTimeout(finish, durationMs);
    const intervalId = window.setInterval(() => {
      if (completedRef.current) {
        return;
      }
      const elapsed = Date.now() - startedAt;
      setRemainingMs(Math.max(durationMs - elapsed, 0));
    }, 50);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [active, durationMs]);

  const progressPercent = durationMs <= 0 ? 0 : (remainingMs / durationMs) * 100;

  return {
    remainingMs,
    progressPercent,
  };
}
