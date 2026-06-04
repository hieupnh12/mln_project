import React, { useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MindmapLevelControls } from '~/features/knowledge-graph/components/MindmapLevelControls';

export function TeacherMindmapCanvas({
  nodes,
  edges,
  setNodes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeContextMenu,
  onPaneClick,
  onNodeClick,
  nodeTypes,
  focusTarget,
  setFocusTarget,
  editingNodeId
}: any) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Hủy bỏ focus nếu người dùng đang click đúp để chỉnh sửa (tránh bị zoom out)
      if (editingNodeId) return;

      if (focusTarget?.id) {
        // Smart Focus: Find ALL visible descendants of the expanded node
        const descendants = new Set<string>();
        const queue = [focusTarget.id];

        while (queue.length > 0) {
          const current = queue.shift();
          if (current) {
            descendants.add(current);
            const children = edges.filter((e: any) => e.source === current).map((e: any) => e.target);
            queue.push(...children);
          }
        }

        const focusNodes = nodes.filter((n: any) => descendants.has(n.id));

        if (focusNodes.length > 0) {
          fitView({ nodes: focusNodes, duration: 800, padding: 0.2, maxZoom: 1.2 });
        } else {
          fitView({ duration: 800, padding: 0.2, maxZoom: 1.2 });
        }
      } else {
        fitView({ duration: 800, padding: 0.2, maxZoom: 1.2 });
      }
    }, 250); // Tăng timeout lên 250ms để bắt kịp sự kiện Double Click trước khi Focus chạy
    return () => clearTimeout(timeout);
  }, [nodes, edges, focusTarget, fitView, editingNodeId]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeContextMenu={onNodeContextMenu}
      onPaneClick={onPaneClick}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      minZoom={0.1}
      maxZoom={3}
      fitView
      className="bg-[var(--color-surface)]"
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="var(--color-outline-variant)" />
      <Controls showInteractive={true} />
      <MiniMap 
        maskColor="rgba(220, 217, 218, 0.6)" 
        nodeColor={(n) => (n.data?.branchColor as string) || '#232733'}
      />
      <Panel position="top-right" className="m-4">
        <div className="bg-white border border-[var(--color-outline-variant)] px-3 py-1.5 rounded-lg shadow-sm">
          <p className="text-[10px] text-[var(--color-on-surface-variant)] italic">
            Click icon để mở rộng/thu gọn nhánh.
          </p>
        </div>
      </Panel>
      <MindmapLevelControls
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setFocusTarget={setFocusTarget}
      />
    </ReactFlow>
  );
}
