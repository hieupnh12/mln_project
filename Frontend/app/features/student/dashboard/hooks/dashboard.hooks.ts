import { useQuery } from "@tanstack/react-query";

import { getAllSubjects } from "../../services/student.service";
import { SUBJECT_QUERY_KEYS } from "../constants/student-dashboard.constants";

export function useSubjects() {
  return useQuery({
    queryKey: SUBJECT_QUERY_KEYS.all,
    queryFn: getAllSubjects,
  });
}
