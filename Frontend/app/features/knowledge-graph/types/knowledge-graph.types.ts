import type { Node, Edge } from '@xyflow/react';

// Dữ liệu tuỳ chỉnh gắn vào mỗi Node
export type KnowledgeGraphNodeData = Record<string, unknown> & {
  id: string;
  title: string;
  entityType: 'CHAPTER' | 'LESSON';
  entityId: number;
};

export type MindmapNode = Node<KnowledgeGraphNodeData>;
export type MindmapEdge = Edge;

// Interface từ Backend trả về
export interface MindmapResponse {
  courseId: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
}

// Payload khi nhấn nút "Lưu sơ đồ"
export interface SaveMindmapPayload {
  courseId: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
}
