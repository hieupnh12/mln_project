import { useQuery } from "@tanstack/react-query";

import { getAllSubjects } from "../../services/student.service";
import { SUBJECT_QUERY_KEYS } from "../../constants/student-api.constants";

const isBrowser = typeof window !== "undefined";

export function useSubjects() {
  return useQuery({
    queryKey: SUBJECT_QUERY_KEYS.all,
    queryFn: getAllSubjects,
    enabled: isBrowser,
  });
}
