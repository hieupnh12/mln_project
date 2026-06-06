import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { SubjectListItem } from "../../types/student.types";
import { STUDENT_PROGRESS_QUERY_KEYS } from "../constants/student-progress-api.constants";
import {
  getSubjectLessonProgress,
  updateLessonProgress,
} from "../services/student-progress.service";
import type { StudentProgressStatus } from "../types/student-progress.types";
import {
  findGlobalResumePoint,
  findResumeInProgressList,
} from "../utils/student-progress-resume.util";

const isBrowser = typeof window !== "undefined";

export function useSubjectLessonProgressQuery(subjectId: number | null) {
  return useQuery({
    queryKey:
      subjectId == null
        ? STUDENT_PROGRESS_QUERY_KEYS.root
        : STUDENT_PROGRESS_QUERY_KEYS.subject(subjectId),
    queryFn: () => getSubjectLessonProgress(subjectId as number),
    enabled: isBrowser && subjectId != null && !Number.isNaN(subjectId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useStudentResumeQuery(subjects: SubjectListItem[] | undefined) {
  return useQuery({
    queryKey: STUDENT_PROGRESS_QUERY_KEYS.resume,
    queryFn: async () => {
      if (!subjects?.length) {
        return null;
      }

      const entries = await Promise.all(
        subjects.map(async (subject) => {
          const progress = await getSubjectLessonProgress(subject.id);
          return [subject.id, progress] as const;
        }),
      );

      const progressBySubject = new Map(entries);
      return findGlobalResumePoint(subjects, progressBySubject);
    },
    enabled: isBrowser && Boolean(subjects?.length),
    staleTime: 30_000,
  });
}

export function useSubjectResumeQuery(subjectId: number | null) {
  const progressQuery = useSubjectLessonProgressQuery(subjectId);

  const resumePoint =
    subjectId != null && progressQuery.data
      ? findResumeInProgressList(subjectId, progressQuery.data)
      : null;

  return {
    ...progressQuery,
    resumePoint,
  };
}

type UpdateLessonProgressVariables = {
  lessonId: number;
  subjectId: number;
  status: StudentProgressStatus;
};

export function useUpdateLessonProgressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, status }: UpdateLessonProgressVariables) =>
      updateLessonProgress(lessonId, status),
    retry: false,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: STUDENT_PROGRESS_QUERY_KEYS.subject(variables.subjectId),
      });
      void queryClient.invalidateQueries({
        queryKey: STUDENT_PROGRESS_QUERY_KEYS.resume,
      });
    },
  });
}
