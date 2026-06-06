import React, { useMemo } from 'react';
import { Panel } from '@xyflow/react';
import { computeClustersAndLevels } from '../utils/mindmap-layout.util';
import type { Node, Edge } from '@xyflow/react';

export function MindmapLevelControls({
  nodes,
  edges,
  setNodes,
  setFocusTarget
}: {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setFocusTarget?: (target: { id: string, ts: number }) => void;
}) {
  const { levels, maxLevel } = useMemo(() => {
    const { levels } = computeClustersAndLevels(nodes, edges);
    let max = 0;
    levels.forEach(l => { if (l > max) max = l; });
    return { levels, maxLevel: max };
  }, [nodes, edges]);

  const handleSetExpandLevel = (targetLevel: number) => {
    setNodes(nds => nds.map(n => {
      const nodeLevel = levels.get(n.id) || 0;
      const hasChildren = edges.some(e => e.source === n.id);
      return {
        ...n,
        data: {
          ...n.data,
          isCollapsed: hasChildren ? (nodeLevel >= targetLevel) : false
        }
      };
    }));
    
    if (setFocusTarget) {
      const rootNode = nodes.find(n => (levels.get(n.id) || 0) === 0);
      if (rootNode) {
        setFocusTarget({ id: rootNode.id, ts: Date.now() });
      }
    }
  };

  if (nodes.length === 0) return null;

  return (
    <Panel position="top-left" className="m-4">
      <div className="bg-white border border-[var(--color-outline-variant)] rounded-lg shadow-md flex flex-col overflow-hidden">
        <div className="px-3 py-1.5 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)] text-[10px] font-bold uppercase tracking-wider text-[var(--color-outline)] text-center flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">account_tree</span>
          Hiển thị theo cấp độ
        </div>
        <div className="flex p-1 gap-1 bg-[var(--color-surface-container-lowest)] items-center">
          <button 
            onClick={() => handleSetExpandLevel(0)}
            className="px-2.5 py-1.5 rounded hover:bg-[var(--color-surface-container-high)] text-[11px] font-semibold text-[var(--color-on-surface)] transition-colors flex items-center gap-1"
            title="Thu gọn toàn bộ (chỉ hiện gốc)"
          >
            <span className="material-symbols-outlined text-[14px]">unfold_less</span>
            Đóng hết
          </button>
          
          <div className="w-[1px] h-4 bg-[var(--color-outline-variant)] mx-1"></div>
          
          <div className="flex items-center gap-0.5">
            {Array.from({ length: Math.min(maxLevel, 4) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSetExpandLevel(idx + 1)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--color-secondary-container)] text-[11px] font-bold text-[var(--color-secondary)] transition-colors"
                title={`Mở đến cấp ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
            {maxLevel > 4 && <span className="text-[10px] text-gray-400 px-1">...</span>}
          </div>

          <div className="w-[1px] h-4 bg-[var(--color-outline-variant)] mx-1"></div>

          <button 
            onClick={() => handleSetExpandLevel(99)}
            className="px-2.5 py-1.5 rounded hover:bg-[var(--color-surface-container-high)] text-[11px] font-semibold text-[var(--color-on-surface)] transition-colors flex items-center gap-1"
            title="Mở rộng toàn bộ"
          >
            <span className="material-symbols-outlined text-[14px]">unfold_more</span>
            Mở hết
          </button>
        </div>
      </div>
    </Panel>
  );
}
