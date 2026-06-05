import { useQuery } from "@tanstack/react-query";

import { EXAMS_CATALOG_STALE_MS, EXAMS_QUERY_KEYS } from "../constants/exams-api.constants";
import { getExamCatalog } from "../services/exams.service";

type UseStudentExamsQueryOptions = {
  subjectId: number | null;
  enabled?: boolean;
  completedLimit?: number;
};

export function useStudentExamsQuery({
  subjectId,
  enabled = true,
  completedLimit = 50,
}: UseStudentExamsQueryOptions) {
  return useQuery({
    queryKey:
      subjectId == null ? EXAMS_QUERY_KEYS.catalog(0) : EXAMS_QUERY_KEYS.catalog(subjectId),
    queryFn: () => getExamCatalog(subjectId as number, completedLimit),
    enabled: enabled && subjectId != null,
    staleTime: EXAMS_CATALOG_STALE_MS,
  });
}
