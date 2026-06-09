import { useQuery } from "@tanstack/react-query";

import { EXAMS_QUERY_KEYS } from "../constants/exams-api.constants";
import { getExamReview } from "../services/exams.service";

type UseExamReviewQueryOptions = {
  subjectId: number | null;
  attemptId: string | undefined;
};

export function useExamReviewQuery({ subjectId, attemptId }: UseExamReviewQueryOptions) {
  return useQuery({
    queryKey:
      subjectId != null && attemptId
        ? EXAMS_QUERY_KEYS.review(subjectId, attemptId)
        : ["student", "exams", "review", "idle"],
    queryFn: () => getExamReview(subjectId as number, attemptId as string),
    enabled: subjectId != null && Boolean(attemptId),
    retry: false,
  });
}
