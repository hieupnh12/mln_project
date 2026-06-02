import { apiClient } from '~/shared/services/api-client';
import type { MindmapResponse, SaveMindmapPayload } from '../types';

export const knowledgeGraphService = {
  getMindmap: async (courseId: string): Promise<MindmapResponse> => {
    const { data } = await apiClient.get<MindmapResponse>(`/v1/courses/${courseId}/mindmap`);
    return data;
  },

  saveMindmap: async (payload: SaveMindmapPayload): Promise<void> => {
    await apiClient.post(`/v1/courses/${payload.courseId}/mindmap`, payload);
  },
};
