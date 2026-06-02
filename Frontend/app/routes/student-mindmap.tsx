import React from 'react';
import { useSearchParams } from 'react-router';
import MindmapCanvas from '../features/knowledge-graph/components/MindmapCanvas';
import { useGetMindmap } from '../features/knowledge-graph/hooks/use-mindmap';
import { getMindmapRadialLayout, applyMindmapStyles } from '../features/knowledge-graph/utils/mindmap-layout.util';

export default function StudentMindmapPage() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');

  const { data: mindmapData, isLoading, isError } = useGetMindmap(courseId || '');

  if (!courseId) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[var(--color-error)] mb-2">Lỗi truy cập</h2>
          <p className="text-[var(--color-on-surface-variant)] mb-4">Không tìm thấy mã môn học. Vui lòng truy cập từ danh sách khóa học.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--color-background)] overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition"
          >
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-on-background)]">Học tập qua Sơ đồ tư duy</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Khám phá mối liên hệ giữa các bài học một cách trực quan.</p>
          </div>
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
        ) : !mindmapData || !mindmapData.nodes || mindmapData.nodes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[var(--color-on-surface-variant)]">
            Chưa có dữ liệu sơ đồ cho môn học này.
          </div>
        ) : (
          (() => {
            let displayNodes = mindmapData.nodes;
            let displayEdges = mindmapData.edges || [];
            
            const styled = applyMindmapStyles(displayNodes, displayEdges);
            displayNodes = styled.nodes as any;
            displayEdges = styled.edges as any;

            const needsAutoLayout = displayNodes.every(n => n.position.x === 0 && n.position.y === 0);
            if (needsAutoLayout && displayNodes.length > 0) {
              const layouted = getMindmapRadialLayout(displayNodes, displayEdges);
              displayNodes = layouted.nodes as any;
              displayEdges = layouted.edges as any;
            }

            return (
              <MindmapCanvas 
                initialNodes={displayNodes} 
                initialEdges={displayEdges} 
                isEditable={false} 
              />
            );
          })()
        )}
      </div>
    </div>
  );
}
