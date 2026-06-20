import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUIZ_MANAGEMENT_QUERY_KEYS } from "../constants/quiz-management.constants";
import { importExamAsQuiz } from "../services/quiz-import.service";
import type { ImportExamAsQuizPayload } from "../types/quiz-import.types";

export function useImportExamQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ImportExamAsQuizPayload) => importExamAsQuiz(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.root });
      queryClient.invalidateQueries({ queryKey: ["teacher", "question-library"] });
    },
  });
}
