import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomEntityNode from './CustomEntityNode';

interface MindmapCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  isEditable: boolean; // true for Teacher, false for Student
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  isSaving?: boolean;
}

export default function MindmapCanvas({ initialNodes, initialEdges, isEditable, onSave, isSaving }: MindmapCanvasProps) {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Register custom node types
  const nodeTypes = useMemo(() => ({ entity: CustomEntityNode }), []);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, edges);
    }
  };

  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.data && (node.data as any).entityType === 'LESSON') {
      const lessonId = (node.data as any).entityId;
      if (isEditable) {
        navigate(`/teacher/lessons/${lessonId}/mindmap`);
      } else {
        navigate(`/student/lessons/${lessonId}/mindmap`);
      }
    }
  }, [navigate, isEditable]);

  const handleAddNode = (entityType: 'CHAPTER' | 'LESSON') => {
    const newNodeId = `node-${Date.now()}`;
    // Random offset between -25 and +25 to prevent exact stacking
    const offsetX = Math.floor(Math.random() * 50) - 25;
    const offsetY = Math.floor(Math.random() * 50) - 25;

    const newNode = {
      id: newNodeId,
      type: 'entity',
      position: { x: 250 + offsetX, y: 150 + offsetY },
      data: {
        id: newNodeId,
        title: entityType === 'CHAPTER' ? 'Chương mới' : 'Bài học mới',
        entityType,
        entityId: Date.now(),
      }
    };
    setNodes((nds) => [...nds, newNode as any]);
  };

  return (
    <div className="w-full h-full relative border border-[var(--color-outline-variant)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isEditable ? onNodesChange : undefined} // disable drag/select if not editable
        onEdgesChange={isEditable ? onEdgesChange : undefined}
        onConnect={isEditable ? onConnect : undefined}
        onNodeDoubleClick={handleNodeDoubleClick}
        nodeTypes={nodeTypes}
        nodesDraggable={isEditable}
        nodesConnectable={isEditable}
        elementsSelectable={true} // Allow selection to view details even in read-only
        minZoom={0.05}
        maxZoom={3}
        fitView
        className="bg-[var(--color-surface)]"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="var(--color-outline-variant)" />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.entityType === 'CHAPTER') return 'var(--color-secondary-container)';
            return 'var(--color-primary-fixed)';
          }}
          maskColor="var(--color-surface-dim)"
        />

        {/* Toolbar UI for Teacher */}
        {isEditable && (
          <Panel position="top-left" className="m-4">
            <div className="flex flex-col gap-2">
              <div className="glass-card px-4 py-2 rounded-lg shadow-sm flex gap-3 items-center bg-white border border-[var(--color-outline-variant)]">
                <span className="text-sm font-semibold text-[var(--color-secondary)]">Công cụ vẽ</span>
                <div className="h-4 w-[1px] bg-[var(--color-outline-variant)] mx-1"></div>
                <button
                  className="px-3 py-1.5 text-xs font-medium bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
                  onClick={() => handleAddNode('CHAPTER')}
                >
                  + Thêm Chương
                </button>
                <button
                  className="px-3 py-1.5 text-xs font-medium bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
                  onClick={() => handleAddNode('LESSON')}
                >
                  + Thêm Bài học
                </button>
                <div className="h-4 w-[1px] bg-[var(--color-outline-variant)] mx-1"></div>
                <button
                  className="px-3 py-1.5 text-xs font-medium bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu sơ đồ'}
                </button>
              </div>
              <div className="px-2">
                <p className="text-[11px] text-[var(--color-on-surface-variant)] italic">
                  Mẹo: Bấm đúp vào tên để sửa. Chọn Node/Đường nối và bấm Delete để xoá.
                </p>
              </div>
            </div>
          </Panel>
        )}

        {/* Indicator for Student */}
        {!isEditable && (
          <Panel position="top-left" className="m-4">
            <div className="bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-[var(--color-on-surface-variant)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Chế độ Học tập
              </span>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
