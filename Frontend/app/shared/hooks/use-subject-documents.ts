import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteSubjectDocument,
  getSubjectDocuments,
  getSubjectDocumentsBySubject,
  uploadSubjectDocument,
} from "../services/subject-document.service";

export const SUBJECT_DOCUMENT_QUERY_KEYS = {
  all: ["subject-documents"] as const,
  bySubject: (subjectId: number) =>
    ["subject-documents", "subject", subjectId] as const,
};

export function useSubjectDocumentsQuery() {
  return useQuery({
    queryKey: SUBJECT_DOCUMENT_QUERY_KEYS.all,
    queryFn: getSubjectDocuments,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useSubjectDocumentsBySubjectQuery(subjectId: number | null) {
  return useQuery({
    queryKey:
      subjectId == null
        ? SUBJECT_DOCUMENT_QUERY_KEYS.all
        : SUBJECT_DOCUMENT_QUERY_KEYS.bySubject(subjectId),
    queryFn: () => getSubjectDocumentsBySubject(subjectId as number),
    enabled: subjectId != null,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useUploadSubjectDocumentMutation(subjectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadSubjectDocument,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: SUBJECT_DOCUMENT_QUERY_KEYS.bySubject(subjectId),
      });
      void queryClient.invalidateQueries({
        queryKey: SUBJECT_DOCUMENT_QUERY_KEYS.all,
      });
    },
  });
}

export function useDeleteSubjectDocumentMutation(subjectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubjectDocument,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: SUBJECT_DOCUMENT_QUERY_KEYS.bySubject(subjectId),
      });
      void queryClient.invalidateQueries({
        queryKey: SUBJECT_DOCUMENT_QUERY_KEYS.all,
      });
    },
  });
}
