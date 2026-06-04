import { useQuery } from "@tanstack/react-query";

import { EXAMS_QUERY_KEYS } from "../constants/exams-api.constants";
import { getExamSession } from "../services/exams.service";

type UseExamSessionQueryOptions = {
  subjectId: number | null;
  quizId: string | undefined;
};

export function useExamSessionQuery({ subjectId, quizId }: UseExamSessionQueryOptions) {
  return useQuery({
    queryKey:
      subjectId != null && quizId
        ? EXAMS_QUERY_KEYS.session(subjectId, quizId)
        : ["student", "exams", "session", "idle"],
    queryFn: () => getExamSession(subjectId as number, quizId as string),
    enabled: subjectId != null && Boolean(quizId),
  });
}
