import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeGraphService } from '../services/knowledge-graph.service';
import { KNOWLEDGE_GRAPH_KEYS } from '../constants/knowledge-graph.constants';
import type { SaveMindmapPayload } from '../types';

export function useGetMindmap(courseId: string) {
  return useQuery({
    queryKey: KNOWLEDGE_GRAPH_KEYS.mindmap(courseId),
    queryFn: () => knowledgeGraphService.getMindmap(courseId),
    enabled: !!courseId,
  });
}

export function useSaveMindmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveMindmapPayload) => knowledgeGraphService.saveMindmap(payload),
    onSuccess: (_, variables) => {
      // Invalidate lại data mới sau khi lưu thành công
      queryClient.invalidateQueries({
        queryKey: KNOWLEDGE_GRAPH_KEYS.mindmap(variables.courseId),
      });
    },
  });
}
