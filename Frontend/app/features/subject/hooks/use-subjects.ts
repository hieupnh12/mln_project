import { useQuery } from "@tanstack/react-query";

import { SUBJECT_QUERY_KEYS } from "../constants/subject.constants";
import { getAllSubjects } from "../services/subject.service";

export function useSubjects() {
  return useQuery({
    queryKey: SUBJECT_QUERY_KEYS.all,
    queryFn: getAllSubjects,
  });
}
