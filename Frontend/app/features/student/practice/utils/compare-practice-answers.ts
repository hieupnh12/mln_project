export function arePracticeSelectionsEqual(
  selectedIndices: number[],
  correctIndices: number[],
): boolean {
  if (selectedIndices.length !== correctIndices.length) {
    return false;
  }

  const selected = [...selectedIndices].sort((a, b) => a - b);
  const correct = [...correctIndices].sort((a, b) => a - b);
  return selected.every((value, index) => value === correct[index]);
}
