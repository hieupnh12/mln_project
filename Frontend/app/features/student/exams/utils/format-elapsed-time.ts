/** Hiển thị thời lượng mm:ss hoặc h:mm:ss khi >= 1 giờ. */
export function formatElapsedTime(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatElapsedWithLimit(elapsedSeconds: number, durationMinutes: number) {
  const limitSeconds = Math.max(0, durationMinutes) * 60;
  const usedUp = limitSeconds > 0 && elapsedSeconds >= limitSeconds;
  return {
    elapsedLabel: formatElapsedTime(elapsedSeconds),
    limitLabel: limitSeconds > 0 ? formatElapsedTime(limitSeconds) : null,
    usedUp,
  };
}
