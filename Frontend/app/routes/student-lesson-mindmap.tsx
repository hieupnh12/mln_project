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
import dagre from 'dagre';
import { fetchLessonDetailApi } from '../features/teacher/course-structure/api/course-structure.api';
import { showErrorToast } from '~/shared/utils/toast';
import { Check, ChevronDown } from 'lucide-react';
import CustomConceptNode from '../features/knowledge-graph/components/CustomConceptNode';

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'LR') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 260; 
  const nodeHeight = 120;

  dagreGraph.setGraph({ rankdir: direction, nodesep: 20, ranksep: 80 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: 'left' as any,
      sourcePosition: 'right' as any,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

function MindmapCanvas({ nodes, edges, nodeTypes, handleNodeClick, lastExpandedNodeId }: any) {
  const { fitView, fitBounds } = useReactFlow();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lastExpandedNodeId) {
        // Smart Focus: Find children of the expanded node
        const childEdges = edges.filter((e: any) => e.source === lastExpandedNodeId);
        const childIds = new Set(childEdges.map((e: any) => e.target));
        const focusNodes = nodes.filter((n: any) => n.id === lastExpandedNodeId || childIds.has(n.id));
        
        if (focusNodes.length > 0) {
          const minX = Math.min(...focusNodes.map((n: any) => n.position.x));
          const maxX = Math.max(...focusNodes.map((n: any) => n.position.x + (n.measured?.width || 260)));
          const minY = Math.min(...focusNodes.map((n: any) => n.position.y));
          const maxY = Math.max(...focusNodes.map((n: any) => n.position.y + (n.measured?.height || 120)));
          
          fitBounds(
            { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
            { duration: 800, padding: 0.2 }
          );
        } else {
           fitView({ duration: 800, padding: 0.2, maxZoom: 1.2 });
        }
      } else {
        fitView({ duration: 800, padding: 0.2, maxZoom: 1.2 });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [nodes.length, lastExpandedNodeId, fitView, fitBounds, edges, nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={true}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
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
          <div className="w-[1px] h-4 bg-[var(--color-outline-variant)]" />
          <span className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check size={8} strokeWidth={3} /></span>
            Click vào node để đánh dấu / bỏ đánh dấu đã học
          </span>
        </div>
      </Panel>
    </ReactFlow>
  );
}

// Helper to compute node levels and clusters dynamically
function computeClustersAndLevels(nodes: Node[], edges: Edge[]) {
  const levels = new Map<string, number>();
  const clusters = new Map<string, number>();

  const targets = new Set(edges.map(e => e.target));
  const roots = nodes.filter(n => !targets.has(n.id));

  const queue: { id: string; level: number; cluster: number }[] = [];

  roots.forEach(r => {
    levels.set(r.id, 0);
    clusters.set(r.id, -1);

    const l1Children = edges.filter(e => e.source === r.id).map(e => e.target);
    l1Children.forEach((child, index) => {
      levels.set(child, 1);
      clusters.set(child, index);
      queue.push({ id: child, level: 1, cluster: index });
    });
  });

  while (queue.length > 0) {
    const { id, level, cluster } = queue.shift()!;
    const children = edges.filter(e => e.source === id).map(e => e.target);
    for (const child of children) {
      if (!levels.has(child)) {
        levels.set(child, level + 1);
        clusters.set(child, cluster);
        queue.push({ id: child, level: level + 1, cluster });
      }
    }
  }

  return { levels, clusters };
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
  const [lastExpandedNodeId, setLastExpandedNodeId] = useState<string | null>(null);

  // Persistent Completed/Read state tracking via localStorage
  const [completedNodeIds, setCompletedNodeIds] = useState<Set<string>>(new Set());

  // Load completed node states
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`completed-nodes-${numericLessonId}`);
      if (saved) {
        setCompletedNodeIds(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error('Failed to load completed nodes from localStorage', e);
    }
  }, [numericLessonId]);

  // Save completed node states
  const saveCompletedNodeIds = useCallback((newIds: Set<string>) => {
    setCompletedNodeIds(newIds);
    try {
      localStorage.setItem(`completed-nodes-${numericLessonId}`, JSON.stringify(Array.from(newIds)));
    } catch (e) {
      console.error('Failed to save completed nodes to localStorage', e);
    }
  }, [numericLessonId]);

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

  // Handle toggling checkmark (✓) status when student clicks node
  const handleNodeClick = useCallback((event: React.MouseEvent, clickedNode: Node) => {
    const newIds = new Set(completedNodeIds);
    if (newIds.has(clickedNode.id)) {
      newIds.delete(clickedNode.id);
    } else {
      newIds.add(clickedNode.id);
    }
    saveCompletedNodeIds(newIds);
  }, [completedNodeIds, saveCompletedNodeIds]);

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
        const isCompleted = completedNodeIds.has(node.id);

        return {
          ...node,
          type: 'concept',
          data: {
            ...node.data,
            level,
            cluster,
            hasChildren,
            isCollapsed,
            isCompleted,
            onToggleCollapse: (nodeId: string) => {
              const newCompleted = new Set(completedNodeIds);
              newCompleted.add(nodeId);
              saveCompletedNodeIds(newCompleted);

              setNodes(nds => nds.map(n => {
                if (n.id === nodeId) {
                  const isNowCollapsed = !(n.data as any).isCollapsed;
                  if (!isNowCollapsed) {
                    setLastExpandedNodeId(nodeId);
                  }
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

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(mappedNodes, mappedEdges, 'LR');

    return { visibleNodes: layoutedNodes, visibleEdges: layoutedEdges };
  }, [nodes, edges, completedNodeIds, saveCompletedNodeIds]);

  // Calculate completion percentage for the premium tracking banner
  const completionPercentage = useMemo(() => {
    if (nodes.length === 0) return 0;
    const completedCount = nodes.filter(n => completedNodeIds.has(n.id)).length;
    return Math.round((completedCount / nodes.length) * 100);
  }, [nodes, completedNodeIds]);

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

        {/* Completion Progress tracking bar */}
        {hasMindmap && (
          <div className="flex items-center gap-3 bg-white border border-[var(--color-outline-variant)] px-4 py-2 rounded-xl shadow-xs shrink-0 max-w-[280px]">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[var(--color-outline)]">Tiến độ bài học</span>
              <span className="text-sm font-bold text-emerald-600">{completionPercentage}% Hoàn thành</span>
            </div>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
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
                handleNodeClick={handleNodeClick} 
                lastExpandedNodeId={lastExpandedNodeId}
              />
            </ReactFlowProvider>
          </div>
        )}
      </div>
    </div>
  );
}
