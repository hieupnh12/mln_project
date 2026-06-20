export function isPracticeMultiChoice(type: string, correctOptionIndices: number[]): boolean {
  const normalizedType = type.trim().toLowerCase();
  if (normalizedType.includes("nhiều") || normalizedType.includes("multiple")) {
    return true;
  }
  return correctOptionIndices.length > 1;
}
