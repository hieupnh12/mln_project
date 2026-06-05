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
import { ChevronDown } from 'lucide-react';
import { MindmapLevelControls } from '~/features/knowledge-graph/components/MindmapLevelControls';

export function StudentMindmapCanvas({ nodes, edges, nodeTypes, focusTarget, onNodeClick, setNodes, setFocusTarget }: any) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const timeout = setTimeout(() => {
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
    }, 150);
    return () => clearTimeout(timeout);
  }, [nodes, edges, focusTarget, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={onNodeClick}
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={true}
      nodeTypes={nodeTypes}
      minZoom={0.1}
      maxZoom={3}
      fitView
      className="bg-[var(--color-surface)]"
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="var(--color-outline-variant)" />
      <Controls showInteractive={false} />
      <MiniMap 
        maskColor="rgba(220, 217, 218, 0.6)" 
        nodeColor={(n) => (n.data?.branchColor as string) || '#232733'}
      />
      <Panel position="bottom-center" className="mb-6">
        <div className="bg-white border border-[var(--color-outline-variant)] px-4 py-2.5 rounded-xl shadow-md flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
            <span className="w-3.5 h-3.5 rounded-full border border-[var(--color-outline)] flex items-center justify-center bg-white"><ChevronDown size={10} className="-rotate-90" /></span>
            Click nút bên phải node để mở rộng nhánh con
          </span>
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
