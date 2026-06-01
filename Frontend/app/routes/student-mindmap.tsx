import React from 'react';
import { useSearchParams } from 'react-router';
import MindmapCanvas from '../features/knowledge-graph/components/MindmapCanvas';
import { useGetMindmap } from '../features/knowledge-graph/hooks/use-mindmap';

export default function StudentMindmapPage() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId') || '1';

  const { data: mindmapData, isLoading, isError } = useGetMindmap(courseId);

  return (
    <div className="flex flex-col h-screen bg-[var(--color-background)] overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition"
          >
            <span className="material-symbols-rounded text-on-surface-variant">arrow_back</span>
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
        ) : !mindmapData || mindmapData.nodes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[var(--color-on-surface-variant)]">
            Chưa có dữ liệu sơ đồ cho môn học này.
          </div>
        ) : (
          <MindmapCanvas 
            initialNodes={mindmapData.nodes} 
            initialEdges={mindmapData.edges} 
            isEditable={false} 
          />
        )}
      </div>
    </div>
  );
}
