import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deletePdfDocument,
  getPdfDocuments,
  uploadPdfDocument,
} from "../services/pdf-document.service";

const PDF_DOCUMENT_QUERY_KEY = ["pdf-documents"] as const;

export function usePdfDocumentsQuery() {
  return useQuery({
    queryKey: PDF_DOCUMENT_QUERY_KEY,
    queryFn: getPdfDocuments,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useUploadPdfDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadPdfDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PDF_DOCUMENT_QUERY_KEY });
    },
  });
}

export function useDeletePdfDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePdfDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PDF_DOCUMENT_QUERY_KEY });
    },
  });
}
