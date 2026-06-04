import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ReactFlowProvider, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import type { Edge, Node } from '@xyflow/react';
import { toPng } from 'html-to-image';

import { fetchLessonDetailApi } from '~/features/teacher/course-structure/api/course-structure.api';
import { showErrorToast, showSuccessToast } from '~/shared/utils/toast';
import CustomConceptNode from '~/features/knowledge-graph/components/CustomConceptNode';
import { getMindmapRadialLayout, computeClustersAndLevels, applyMindmapStyles } from '~/features/knowledge-graph/utils/mindmap-layout.util';
import { StudentMindmapCanvas } from '../components/student-mindmap-canvas';

export function StudentLessonMindmapPage() {
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

  const handleDownload = () => {
    if (visibleNodes.length === 0) return;
    
    showSuccessToast("Đang chuẩn bị ảnh tải xuống...");
    
    setTimeout(() => {
      const nodesBounds = getNodesBounds(visibleNodes);
      const padding = 100;
      const imageWidth = nodesBounds.width + padding * 2;
      const imageHeight = nodesBounds.height + padding * 2;
      const viewportProps = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, padding);
      
      const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewport) return;

      toPng(viewport, {
        backgroundColor: '#fcf8f9',
        width: imageWidth,
        height: imageHeight,
        pixelRatio: 4, // Tăng độ nét gấp 4 lần (Ultra HD)
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewportProps.x}px, ${viewportProps.y}px) scale(${viewportProps.zoom})`,
        },
      })
        .then((dataUrl) => {
          const a = document.createElement('a');
          a.setAttribute('download', `Sodo-${lessonTitle}.png`);
          a.setAttribute('href', dataUrl);
          a.click();
        })
        .catch((err) => {
          showErrorToast("Lỗi tải ảnh: " + err.message);
        });
    }, 100);
  };

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

        {hasMindmap && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">download</span>
            Tải chất lượng cao
          </button>
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
              <StudentMindmapCanvas 
                nodes={visibleNodes} 
                edges={visibleEdges} 
                nodeTypes={nodeTypes} 
                focusTarget={focusTarget}
                onNodeClick={(_: any, node: Node) => setFocusTarget({ id: node.id, ts: Date.now() })}
                setNodes={setNodes}
                setFocusTarget={setFocusTarget}
              />
            </ReactFlowProvider>
          </div>
        )}
      </div>
    </div>
  );
}
