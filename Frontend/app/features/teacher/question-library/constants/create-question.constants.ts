import type { BloomLevel } from "../types/question-library.types";

export const editorToolbarActions = [
  "format_bold",
  "format_italic",
  "format_list_bulleted",
  "functions",
  "image",
] as const;

export const bloomLevelOptions: BloomLevel[] = [
  "Nhận biết",
  "Hiểu",
  "Vận dụng",
  "Phân tích",
  "Tổng hợp",
  "Đánh giá",
];

export const optionLabels = ["A", "B", "C", "D"] as const;

export const createQuestionReferenceImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDfenozJd1NA7a84YjykB3ToyxHH2dd7WRWWqNgQRoDpwfBtGjFtI1K6UvpZ4mq-Xd13ujJ66Ub2Hf5AXucTu1ejsTd47kvQO2Zeoua14vQTOoIkrKqJnTuYDo4duGVLg4dhoUNkuBGCGvKls5p_g9KpRnUhH7zVZ71iCnAC0gHFzxTczv9q36Sb8qrZ4TywUnftO6hAA6pEp8LKJxK7kjp77kaU9YBYVcpgFXSEK6u0uIXnxDYymMxCV0776dgHBFlcxGbkdv4a8s";
