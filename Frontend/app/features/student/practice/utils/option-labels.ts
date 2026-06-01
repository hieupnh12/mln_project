const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"] as const;

export function getOptionLabel(index: number): string {
  return OPTION_LABELS[index] ?? String(index + 1);
}
