import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { fetchLessonDetailApi, updateLessonApi } from '../features/teacher/course-structure/api/course-structure.api';
import { showSuccessToast, showErrorToast } from '~/shared/utils/toast';
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

function TeacherMindmapCanvas({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  onNodeContextMenu,
  onPaneClick,
  nodeTypes, 
  lastExpandedNodeId 
}: any) {
  const { fitView, fitBounds } = useReactFlow();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lastExpandedNodeId) {
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
           fitView({ duration: 800, padding: 0.2 });
        }
      } else {
        fitView({ duration: 800, padding: 0.2 });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [nodes.length, lastExpandedNodeId, fitView, fitBounds, edges, nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeContextMenu={onNodeContextMenu}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      fitView
      className="bg-[var(--color-surface)]"
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="var(--color-outline-variant)" />
      <Controls showInteractive={true} />
      <MiniMap maskColor="var(--color-surface-dim)" />
      <Panel position="top-right" className="m-4">
        <div className="bg-white border border-[var(--color-outline-variant)] px-3 py-1.5 rounded-lg shadow-sm">
          <p className="text-[10px] text-[var(--color-on-surface-variant)] italic">
            Sơ đồ tự động xếp trái-sang-phải. Click icon để mở rộng nhánh.
          </p>
        </div>
      </Panel>
    </ReactFlow>
  );
}

// Dynamic Level and Cluster calculations helper
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

export default function TeacherLessonMindmapPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const numericLessonId = Number(lessonId);

  const [lessonTitle, setLessonTitle] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [jsonText, setJsonText] = useState('');

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [lastExpandedNodeId, setLastExpandedNodeId] = useState<string | null>(null);

  // Advanced features states
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [menu, setMenu] = useState<{ id: string; top: number; left: number; right: number; bottom: number; node: Node } | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const pushHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev,
      {
        nodes: structuredClone(nodes),
        edges: structuredClone(edges),
      },
    ]);
  }, [nodes, edges]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setNodes(previousState.nodes);
    setEdges(previousState.edges);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  }, [history, setNodes, setEdges]);

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
            if (parsed.nodes && Array.isArray(parsed.nodes)) {
              setNodes(parsed.nodes);
              setJsonText(JSON.stringify(parsed, null, 2));
            }
            if (parsed.edges && Array.isArray(parsed.edges)) {
              setEdges(parsed.edges);
            }
          } catch (e) {
            console.error('Failed to parse lesson mindmap JSON', e);
          }
        }
      } catch (err) {
        showErrorToast('Không thể tải thông tin bài học.');
      } finally {
        setIsLoading(false);
      }
    }
    if (numericLessonId) {
      loadLesson();
    }
  }, [numericLessonId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds)),
    [setEdges],
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Clean temporary properties before saving (save clean Nodes & Edges)
      const cleanNodes = nodes.map(n => ({
        id: n.id,
        position: n.position,
        data: { 
          label: n.data?.label, 
          isCollapsed: !!n.data?.isCollapsed,
          nodeRole: n.data?.nodeRole 
        }
      }));
      const cleanEdges = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: e.animated
      }));

      const content = JSON.stringify({ nodes: cleanNodes, edges: cleanEdges });
      await updateLessonApi(numericLessonId, { content });
      showSuccessToast('Đã lưu sơ đồ tư duy bài học thành công!');
      setHistory([]); // Clear history on save
    } catch (err) {
      showErrorToast('Không thể lưu sơ đồ tư duy.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
        throw new Error('Dữ liệu JSON thiếu mảng nodes hợp lệ.');
      }
      setNodes(parsed.nodes);
      setEdges(parsed.edges || []);
      showSuccessToast('Đã dựng sơ đồ tư duy từ JSON thành công!');
    } catch (err: any) {
      showErrorToast(`JSON không hợp lệ: ${err.message}`);
    }
  };

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
        right: event.clientX,
        bottom: event.clientY,
        node,
      });
      setEditingNodeId(null);
    },
    [setMenu],
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
    setEditingNodeId(null);
  }, [setMenu]);

  const handleAddNodeChild = () => {
    if (!menu) return;
    pushHistory();
    const newNodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      position: { x: 0, y: 0 },
      data: { label: 'Node mới', nodeRole: 'concept', isCollapsed: false },
    };
    const newEdge: Edge = {
      id: `edge-${menu.id}-${newNodeId}`,
      source: menu.id,
      target: newNodeId,
      type: 'smoothstep',
      animated: true,
    };
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === menu.id) {
          return { ...n, data: { ...n.data, isCollapsed: false } };
        }
        return n;
      }).concat(newNode)
    );
    setEdges((eds) => eds.concat(newEdge));
    setMenu(null);
  };

  const handleOpenEdit = () => {
    if (!menu) return;
    setEditingNodeId(menu.id);
    setMenu(null);
  };

  const handleDeleteNode = () => {
    if (!menu) return;
    pushHistory();
    
    // Cascading delete: Find all descendants of menu.id
    const descendants = new Set<string>();
    const queue = [menu.id];
    
    const childrenMap = new Map<string, string[]>();
    edges.forEach(e => {
      if (!childrenMap.has(e.source)) childrenMap.set(e.source, []);
      childrenMap.get(e.source)!.push(e.target);
    });

    while(queue.length > 0) {
      const current = queue.shift()!;
      descendants.add(current);
      const children = childrenMap.get(current) || [];
      queue.push(...children);
    }

    setNodes((nds) => nds.filter((n) => !descendants.has(n.id)));
    setEdges((eds) => eds.filter((e) => !descendants.has(e.source) && !descendants.has(e.target)));
    setMenu(null);
  };

  // Process nodes to add levels, clusters, collapse handlers, and custom type
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

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes.filter(n => !hiddenNodeIds.has(n.id)).map(node => {
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
            isEditing: editingNodeId === node.id,
            onSaveEdit: (newLabel: string) => {
              if (newLabel.trim() && newLabel !== node.data?.label) {
                pushHistory();
                setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n));
              }
              setEditingNodeId(null);
            },
            onCancelEdit: () => setEditingNodeId(null),
            onDoubleClickEdit: () => {
              setMenu(null);
              setEditingNodeId(node.id);
            },
            onToggleCollapse: (nodeId: string) => {
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
      }), 
      mappedEdges, 
      'LR'
    );

    return { visibleNodes: layoutedNodes, visibleEdges: layoutedEdges };
  }, [nodes, edges, setNodes, editingNodeId, pushHistory]);

  const copyPromptText = () => {
    const prompt = `Bạn là một chuyên gia bóc tách kiến thức chuyên sâu và kiến trúc sư dữ liệu UI.
Nhiệm vụ của bạn là phân tích toàn bộ văn bản giáo trình ở cuối, trích xuất KHÔNG SÓT MỘT Ý NÀO (bao gồm luận điểm, luận cứ, định nghĩa, mốc thời gian, tên nhân vật, ví dụ và câu trích dẫn) để cấu trúc thành JSON cho thư viện React Flow vẽ Mindmap siêu chi tiết.

QUY TẮC CẤU TRÚC SIÊU CHI TIẾT:
1. Độ sâu không giới hạn: Hãy bẻ nhỏ các ý sâu từ 4 đến 6 tầng (Gốc -> Mục lớn -> Mục nhỏ -> Khái niệm -> Đặc điểm -> Ví dụ/Dẫn chứng cụ thể).
2. Tách biệt hoàn toàn: Các khái niệm song hành hoặc các ví dụ liệt kê bắt buộc phải tách thành các Node con độc lập, tuyệt đối không gộp chung vào một Node bằng dấu phẩy.
3. Tính toán tọa độ (Giao diện Ngang - Left to Right):
- Nút gốc ở x: 0, y: 300.
- Các nhánh con phát triển từ trái sang phải, tịnh tiến theo trục X (x tăng dần 300 - 400 đơn vị mỗi tầng).
- Các nhánh ngang hàng dàn trải theo trục Y để đảm bảo các node không đè lên nhau.
4. Nhãn (Label): Ngắn gọn nhưng phải đầy đủ thông tin cốt lõi (Dưới 12 từ).
5. Phân loại Role: Mỗi node phải có một trường data.nodeRole mang 1 trong các giá trị sau để UI tô màu: 'root', 'chapter', 'concept', 'timeline', 'example', 'quote'.
6. Đầu ra: CHỈ TRẢ VỀ DUY NHẤT một khối code JSON hợp lệ.

CẤU TRÚC JSON MẪU:
{
  "nodes": [
    { "id": "root", "type": "input", "data": { "label": "${lessonTitle}", "nodeRole": "root" }, "position": { "x": 500, "y": 0 } }
    // ... các node chi tiết cấp sâu tiếp theo
  ],
  "edges": [
    // ... các kết nối chi tiết tương ứng, bật animated: true cho các nhánh chính
  ]
}

DƯỚI ĐÂY LÀ VĂN BẢN BÀI HỌC CẦN BÓC TÁCH CHI TIẾT:
[DÁN ĐOẠN VĂN BẢN THÔ CỦA BÀI HỌC "${lessonTitle}" VÀO ĐÂY]`;

    navigator.clipboard.writeText(prompt);
    showSuccessToast('Đã sao chép prompt AI nâng cấp vào clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-background)]">
        <p className="text-body-md text-[var(--color-outline)]">Đang tải cấu trúc bài học...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--color-background)] overflow-hidden">
      {/* Sidebar - Control Panel */}
      <aside className="w-full lg:w-[380px] bg-white border-b lg:border-b-0 lg:border-r border-[var(--color-outline-variant)] flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition"
            type="button"
            title="Quay lại"
          >
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-outline)]">
              {chapterName}
            </span>
            <h1 className="text-xl font-bold text-[var(--color-primary)] truncate max-w-[240px]">
              {lessonTitle}
            </h1>
          </div>
        </div>

        <div className="mb-6 bg-[var(--color-surface-container-low)] p-4 rounded-xl border border-[var(--color-outline-variant)]">
          <h2 className="text-sm font-bold text-[var(--color-primary-container)] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[var(--color-secondary)]">hub</span>
            Công cụ bóc tách AI
          </h2>
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">
            Copy Prompt bên dưới dán vào AI để trích xuất sơ đồ 4-6 cấp độ sâu chi tiết và dán ngược lại JSON vào hệ thống:
          </p>
          <button
            onClick={copyPromptText}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-4 py-2 text-xs font-bold transition hover:opacity-90"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Sao chép AI Prompt (Chi tiết)
          </button>
        </div>

        <div className="flex-1 flex flex-col mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] mb-2">
            Dữ liệu sơ đồ (JSON)
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder="Dán mã JSON sơ đồ tư duy chi tiết từ AI tại đây..."
            className="flex-1 min-h-[220px] w-full rounded-lg border border-[var(--color-outline-variant)] p-3 text-xs font-mono bg-[var(--color-surface-container-lowest)] focus:border-[var(--color-secondary)] focus:outline-none resize-none"
          />
          <button
            onClick={handleApplyJson}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-container)] text-[var(--color-on-primary)] px-4 py-2.5 text-xs font-bold transition hover:opacity-90"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">settings_ethernet</span>
            Dựng sơ đồ từ JSON
          </button>
        </div>

        <div className="mt-auto border-t border-[var(--color-outline-variant)] pt-4 flex flex-wrap gap-2">
          <button
            onClick={() => window.history.back()}
            className="flex-1 min-w-[70px] rounded-lg border border-[var(--color-outline-variant)] py-2.5 text-xs font-bold text-[var(--color-on-surface-variant)] hover:bg-black/5 transition text-center"
            type="button"
          >
            Hủy
          </button>
          
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || isSaving}
            className="flex-1 min-w-[80px] rounded-lg border border-[var(--color-outline-variant)] py-2.5 text-xs font-bold text-[var(--color-on-surface-variant)] hover:bg-black/5 transition text-center disabled:opacity-50 flex items-center justify-center gap-1"
            type="button"
            title="Hoàn tác thao tác cuối"
          >
            <span className="material-symbols-outlined text-[14px]">undo</span> Undo
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 min-w-[100px] rounded-lg bg-[var(--color-secondary)] py-2.5 text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-50 text-center"
            type="button"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu sơ đồ'}
          </button>
        </div>
      </aside>

      {/* Editor Canvas */}
      <main className="flex-1 h-full relative">
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] p-6 text-center z-10">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center text-[var(--color-outline)] mb-4">
              <span className="material-symbols-outlined text-3xl">hub</span>
            </div>
            <h3 className="text-md font-bold text-[var(--color-primary-container)]">Chưa có Sơ đồ tư duy</h3>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 max-w-[280px] leading-relaxed">
              Bài học này hiện chưa được thiết lập Sơ đồ tư duy. Hãy copy Prompt AI ở bên trái, lấy chuỗi JSON từ AI dán vào ô văn bản rồi bấm "Dựng sơ đồ".
            </p>
          </div>
        ) : null}

        <div className="w-full h-full">
          <ReactFlowProvider>
            <TeacherMindmapCanvas 
              nodes={visibleNodes}
              edges={visibleEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeContextMenu={onNodeContextMenu}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              lastExpandedNodeId={lastExpandedNodeId}
            />
          </ReactFlowProvider>
        </div>

        {/* Context Menu Component */}
        {menu && (
          <div
            style={{ top: menu.top, left: menu.left }}
            className="fixed z-[100] bg-white border border-[var(--color-outline-variant)] shadow-xl rounded-lg py-1 min-w-[150px] overflow-hidden"
            onMouseLeave={() => setMenu(null)}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-outline)] border-b border-[var(--color-outline-variant)] mb-1 truncate">
              {menu.node.data?.label as string || 'Tùy chọn'}
            </div>
            <button
              className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] flex items-center gap-2 transition-colors"
              onClick={handleAddNodeChild}
            >
              <span className="material-symbols-outlined text-[16px] text-[var(--color-secondary)]">add_circle</span> 
              Thêm nhánh
            </button>
            <button
              className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[var(--color-on-surface)] hover:bg-blue-50 flex items-center gap-2 transition-colors"
              onClick={handleOpenEdit}
            >
              <span className="material-symbols-outlined text-[16px] text-blue-600">edit_square</span> 
              Sửa nội dung
            </button>
            <div className="h-[1px] bg-[var(--color-outline-variant)] my-1"></div>
            <button
              className="w-full text-left px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              onClick={handleDeleteNode}
            >
              <span className="material-symbols-outlined text-[16px]">delete</span> 
              Xóa nhánh
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
