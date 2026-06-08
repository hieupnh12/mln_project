import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SUBJECT_QUERY_KEYS } from "~/features/student/constants/student-api.constants";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import { COURSE_STRUCTURE_QUERY_KEYS } from "../constants/course-structure-api.constants";
import { createSubject, deleteSubject, updateSubject } from "../services/subject.service";
import type { CreateSubjectPayload, UpdateSubjectPayload } from "../types/course-structure-api.types";

function invalidateSubjectLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: COURSE_STRUCTURE_QUERY_KEYS.subjects });
  queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEYS.all });
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubjectPayload) => createSubject(payload),
    onSuccess: () => {
      invalidateSubjectLists(queryClient);
      showSuccessToast("Đã thêm môn học mới.");
    },
    onError: () => {
      showErrorToast("Không thể thêm môn học. Vui lòng thử lại.");
    },
  });
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subjectId,
      payload,
    }: {
      subjectId: number;
      payload: UpdateSubjectPayload;
    }) => updateSubject(subjectId, payload),
    onSuccess: (_data, variables) => {
      invalidateSubjectLists(queryClient);
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.subject(variables.subjectId),
      });
      showSuccessToast("Đã cập nhật môn học.");
    },
    onError: () => {
      showErrorToast("Không thể cập nhật môn học. Vui lòng thử lại.");
    },
  });
}

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subjectId: number) => deleteSubject(subjectId),
    onSuccess: () => {
      invalidateSubjectLists(queryClient);
      showSuccessToast("Đã xóa môn học.");
    },
    onError: () => {
      showErrorToast("Không thể xóa môn học. Vui lòng thử lại.");
    },
  });
}
