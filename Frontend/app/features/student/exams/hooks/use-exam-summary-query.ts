import { useQuery } from "@tanstack/react-query";

import { EXAMS_QUERY_KEYS } from "../constants/exams-api.constants";
import { getExamSummary } from "../services/exams.service";
import { saveExamSummary } from "../utils/exam-summary-storage";

type UseExamSummaryQueryOptions = {
  subjectId: number | null;
  attemptId: string | undefined;
  enabled?: boolean;
};

export function useExamSummaryQuery({
  subjectId,
  attemptId,
  enabled = true,
}: UseExamSummaryQueryOptions) {
  return useQuery({
    queryKey:
      subjectId != null && attemptId
        ? EXAMS_QUERY_KEYS.summary(subjectId, attemptId)
        : ["student", "exams", "summary", "idle"],
    queryFn: async () => {
      const data = await getExamSummary(subjectId as number, attemptId as string);
      if (attemptId) {
        saveExamSummary(attemptId, data);
      }
      return data;
    },
    enabled: enabled && subjectId != null && Boolean(attemptId),
  });
}
