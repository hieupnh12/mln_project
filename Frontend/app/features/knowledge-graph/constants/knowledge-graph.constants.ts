export const KNOWLEDGE_GRAPH_KEYS = {
  all: ['knowledge-graph'] as const,
  mindmap: (courseId: string) => [...KNOWLEDGE_GRAPH_KEYS.all, 'mindmap', courseId] as const,
};
