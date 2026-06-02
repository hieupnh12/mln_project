import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import type { Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { fetchLessonDetailApi } from '../features/teacher/course-structure/api/course-structure.api';
import { showErrorToast } from '~/shared/utils/toast';
import { ChevronDown } from 'lucide-react';
import CustomConceptNode from '../features/knowledge-graph/components/CustomConceptNode';
import { getMindmapRadialLayout, computeClustersAndLevels, applyMindmapStyles } from '../features/knowledge-graph/utils/mindmap-layout.util';

function MindmapCanvas({ nodes, edges, nodeTypes, focusTarget, onNodeClick }: any) {
  const { fitView, fitBounds } = useReactFlow();

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
      <MiniMap maskColor="var(--color-surface-dim)" />
      <Panel position="bottom-center" className="mb-6">
        <div className="bg-white border border-[var(--color-outline-variant)] px-4 py-2.5 rounded-xl shadow-md flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
            <span className="w-3.5 h-3.5 rounded-full border border-[var(--color-outline)] flex items-center justify-center bg-white"><ChevronDown size={10} className="-rotate-90" /></span>
            Click nút bên phải node để mở rộng nhánh con
          </span>
        </div>
      </Panel>
    </ReactFlow>
  );
}



export default function StudentLessonMindmapPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const numericLessonId = Number(lessonId);

  const [lessonTitle, setLessonTitle] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasMindmap, setHasMindmap] = useState(false);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [focusTarget, setFocusTarget] = useState<{ id: string, ts: number } | null>(null);

  // Register our custom concept node
  const nodeTypes = useMemo(() => ({ concept: CustomConceptNode }), []);

  // Fetch lesson detail
  useEffect(() => {
    async function loadLesson() {
      try {
        setIsLoading(true);
        const data = await fetchLessonDetailApi(numericLessonId);
        setLessonTitle(data.title);
        setChapterName(data.chapterName);
        if (data.content) {
          try {
            const parsed = JSON.parse(data.content);
            if (parsed.nodes && Array.isArray(parsed.nodes) && parsed.nodes.length > 0) {
              
              // Set initial collapse: collapse all nodes at level 2 or deeper by default
              const { levels } = computeClustersAndLevels(parsed.nodes, parsed.edges || []);
              const initialNodes = parsed.nodes.map((n: Node) => {
                const level = levels.get(n.id) || 0;
                // If node is level >= 1 and has children, default to collapsed to prevent overlap and cognitive overload
                const hasChildren = (parsed.edges || []).some((e: Edge) => e.source === n.id);
                const shouldCollapse = level >= 1 && hasChildren;
                
                return {
                  ...n,
                  data: {
                    ...n.data,
                    isCollapsed: n.data?.isCollapsed !== undefined ? n.data.isCollapsed : shouldCollapse
                  }
                };
              });

              setNodes(initialNodes);
              setEdges(parsed.edges || []);
              setHasMindmap(true);
            } else {
              setHasMindmap(false);
            }
          } catch (e) {
            console.error('Failed to parse lesson mindmap JSON', e);
            setHasMindmap(false);
          }
        } else {
          setHasMindmap(false);
        }
      } catch (err) {
        showErrorToast('Không thể tải thông tin sơ đồ bài học.');
      } finally {
        setIsLoading(false);
      }
    }
    if (numericLessonId) {
      loadLesson();
    }
  }, [numericLessonId]);

  // Compute visibility and properties of nodes dynamically
  const { visibleNodes, visibleEdges } = useMemo(() => {
    const parentMap = new Map<string, string>();
    edges.forEach(e => parentMap.set(e.target, e.source));

    const collapsedNodeIds = new Set(
      nodes.filter(n => n.data && (n.data as any).isCollapsed).map(n => n.id)
    );

    const hiddenNodeIds = new Set<string>();
    nodes.forEach(node => {
      let currentId = node.id;
      while (parentMap.has(currentId)) {
        const parentId = parentMap.get(currentId)!;
        if (collapsedNodeIds.has(parentId)) {
          hiddenNodeIds.add(node.id);
          break;
        }
        currentId = parentId;
      }
    });

    const { levels, clusters } = computeClustersAndLevels(nodes, edges);

    const mappedNodes = nodes
      .filter(node => !hiddenNodeIds.has(node.id))
      .map(node => {
        const level = levels.get(node.id) || 0;
        const cluster = clusters.get(node.id) !== undefined ? clusters.get(node.id)! : -1;
        const hasChildren = edges.some(e => e.source === node.id);
        const isCollapsed = !!node.data?.isCollapsed;

        return {
          ...node,
          type: 'concept',
          data: {
            ...node.data,
            level,
            cluster,
            hasChildren,
            isCollapsed,
            onToggleCollapse: (nodeId: string) => {
              setNodes(nds => nds.map(n => {
                if (n.id === nodeId) {
                  const isNowCollapsed = !(n.data as any).isCollapsed;
                  // ALWAYS trigger focus, whether expanding or collapsing
                  setFocusTarget({ id: nodeId, ts: Date.now() });
                  
                  return {
                    ...n,
                    data: {
                      ...n.data,
                      isCollapsed: isNowCollapsed
                    }
                  };
                }
                return n;
              }));
            }
          }
        };
      });

    const mappedEdges = edges
      .filter(edge => !hiddenNodeIds.has(edge.source) && !hiddenNodeIds.has(edge.target))
      .map(edge => {
        const sourceLevel = levels.get(edge.source) || 0;
        return {
          ...edge,
          type: 'smoothstep',
          animated: sourceLevel === 0 ? true : !!edge.animated,
        };
      });

    const styled = applyMindmapStyles(mappedNodes, mappedEdges);
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getMindmapRadialLayout(styled.nodes as any, styled.edges as any);

    return { visibleNodes: layoutedNodes, visibleEdges: layoutedEdges };
  }, [nodes, edges]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-background)]">
        <p className="text-body-md text-[var(--color-outline)]">Đang tải sơ đồ bài học...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--color-background)] overflow-hidden p-6">
      {/* Header section */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition"
            type="button"
            title="Quay lại"
          >
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <div>
            <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wider">
              {chapterName}
            </span>
            <h1 className="text-2xl font-bold text-[var(--color-on-background)]">
              Sơ đồ tư duy bài: {lessonTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Canvas & fallback */}
      <div className="flex-1 rounded-xl shadow-sm border border-[var(--color-outline-variant)] bg-white overflow-hidden relative">
        {!hasMindmap ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] p-6 text-center z-10">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center text-[var(--color-outline)] mb-4">
              <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
            </div>
            <h3 className="text-md font-bold text-[var(--color-primary-container)]">Sơ đồ trống</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 max-w-[320px] leading-relaxed">
              Bài học này chưa được cấu hình Sơ đồ tư duy. Vui lòng quay lại sau!
            </p>
          </div>
        ) : (
          <div className="w-full h-full">
            <ReactFlowProvider>
              <MindmapCanvas 
                nodes={visibleNodes} 
                edges={visibleEdges} 
                nodeTypes={nodeTypes} 
                focusTarget={focusTarget}
                onNodeClick={(_: any, node: Node) => setFocusTarget({ id: node.id, ts: Date.now() })}
              />
            </ReactFlowProvider>
          </div>
        )}
      </div>
    </div>
  );
}
