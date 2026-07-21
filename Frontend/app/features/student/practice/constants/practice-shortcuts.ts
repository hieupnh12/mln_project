export type PracticeShortcutItem = {
  keys: string;
  label: string;
};

export const PRACTICE_SHORTCUTS: PracticeShortcutItem[] = [
  { keys: "A–D / 1–4", label: "Chọn đáp án" },
  { keys: "Enter", label: "Xác nhận (nhiều đáp án)" },
  { keys: "Enter / Space", label: "Câu tiếp theo" },
  { keys: "→ / N", label: "Câu tiếp theo" },
];
