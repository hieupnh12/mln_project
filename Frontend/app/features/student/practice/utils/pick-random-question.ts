import type { PracticeQuestion } from "../types/practice.types";

export function pickRandomQuestion(
  pool: PracticeQuestion[],
  excludeId: string | null,
): PracticeQuestion | null {
  if (pool.length === 0) {
    return null;
  }

  const candidates =
    excludeId == null || pool.length === 1
      ? pool
      : pool.filter((item) => item.id !== excludeId);

  const source = candidates.length > 0 ? candidates : pool;
  const index = Math.floor(Math.random() * source.length);
  return source[index] ?? null;
}
