import React from 'react';
import { useSearchParams } from 'react-router';
import MindmapCanvas from '../features/knowledge-graph/components/MindmapCanvas';
import { useGetMindmap, useSaveMindmap } from '../features/knowledge-graph/hooks/use-mindmap';
import type { Node, Edge } from '@xyflow/react';

export default function TeacherMindmapPage() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId') || '1';

  const { data: mindmapData, isLoading, isError } = useGetMindmap(courseId);
  const { mutate: saveMindmap, isPending: isSaving } = useSaveMindmap();

  const handleSave = (nodes: Node[], edges: Edge[]) => {
    saveMindmap({
      courseId,
      nodes: nodes as any,
      edges: edges as any,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--color-background)] overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-on-background)]">Quản lý Sơ đồ tư duy (Giáo viên)</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Kéo thả để sắp xếp, nối các điểm để tạo quan hệ.</p>
        </div>
      </div>
      
      <div className="flex-1 rounded-xl shadow-sm border border-[var(--color-outline-variant)] bg-white overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-[var(--color-on-surface-variant)]">
            Đang tải dữ liệu sơ đồ...
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-[var(--color-error)]">
            Không thể tải dữ liệu sơ đồ. Vui lòng thử lại sau.
          </div>
        ) : !mindmapData || mindmapData.nodes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[var(--color-on-surface-variant)]">
            Chưa có dữ liệu sơ đồ cho môn học này.
          </div>
        ) : (
          <MindmapCanvas 
            initialNodes={mindmapData.nodes} 
            initialEdges={mindmapData.edges} 
            isEditable={true} 
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
