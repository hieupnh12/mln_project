export const QUESTION_DELETE_ACTIVITY = {
  singleId: "question-library-delete",
  singleLabel: "Đang xóa câu hỏi",
  bulkId: "question-library-bulk-delete",
  bulkLabel: "Đang xóa câu hỏi đã chọn",
} as const;

export const QUESTION_DELETE_CONFIRM_COPY = {
  singleTitle: "Xóa câu hỏi?",
  singleDescription:
    "Câu hỏi sẽ bị xóa khỏi ngân hàng. Hành động này không thể hoàn tác.",
  singleConfirmLabel: "Xóa câu hỏi",
  singleSuccess: "Đã xóa câu hỏi.",
  bulkTitle: (count: number) => `Xóa ${count} câu hỏi đã chọn?`,
  bulkDescription:
    "Tất cả câu hỏi đã chọn sẽ bị xóa khỏi ngân hàng. Hành động này không thể hoàn tác.",
  bulkConfirmLabel: "Xóa đã chọn",
  bulkSuccess: (count: number) => `Đã xóa ${count} câu hỏi.`,
} as const;
