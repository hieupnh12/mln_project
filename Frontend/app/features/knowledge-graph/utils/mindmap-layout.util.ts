import type { Edge, Node } from '@xyflow/react';
import dagre from 'dagre';

export function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'LR') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction, nodesep: 25, ranksep: 100 });

  nodes.forEach((node) => {
    // Dynamically estimate width and height based on text length to avoid overly sparse layout
    const label = (node.data?.label as string) || '';
    
    // Root node has aspect-square and is generally larger
    if (node.data?.level === 0) {
      dagreGraph.setNode(node.id, { width: 140, height: 140 });
      return;
    }

    const maxCharsPerLine = 35;
    const lines = Math.max(1, Math.ceil(label.length / maxCharsPerLine));
    
    // Estimate width: (approx 7px per char) + (padding px-5 = 40px) + (collapse button = 24px)
    const estimatedWidth = Math.min(280, Math.max(90, label.length * 7 + 64));
    
    // Estimate height: (approx 20px per line) + (padding py-2 = 16px)
    const estimatedHeight = Math.max(40, lines * 20 + 16);

    dagreGraph.setNode(node.id, { width: estimatedWidth, height: estimatedHeight });
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
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export function computeClustersAndLevels(nodes: Node[], edges: Edge[]) {
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

// Hàm chia nhánh và áp dụng thuật toán toả ra 2 bên (Trái/Phải)
export function getMindmapRadialLayout(nodes: Node[], edges: Edge[]) {
  if (nodes.length <= 1) return getLayoutedElements(nodes, edges, 'LR');

  const targets = new Set(edges.map(e => e.target));
  const root = nodes.find(n => !targets.has(n.id));
  if (!root) return getLayoutedElements(nodes, edges, 'LR');

  const chapters = edges.filter((e) => e.source === root.id).map((e) => e.target);
  
  const leftChapters = new Set<string>();
  const rightChapters = new Set<string>();
  
  chapters.forEach((chapter, index) => {
    if (index % 2 === 0) {
      rightChapters.add(chapter);
    } else {
      leftChapters.add(chapter);
    }
  });

  const getDescendants = (startNodes: Set<string>) => {
    const desc = new Set(startNodes);
    let queue = Array.from(startNodes);
    while (queue.length > 0) {
      const current = queue.shift()!;
      const children = edges.filter(e => e.source === current).map(e => e.target);
      for (const c of children) {
        if (!desc.has(c)) {
          desc.add(c);
          queue.push(c);
        }
      }
    }
    return desc;
  };

  const leftDesc = getDescendants(leftChapters);
  const rightDesc = getDescendants(rightChapters);

  const leftNodes = nodes.filter(n => leftDesc.has(n.id) || n.id === root.id);
  const rightNodes = nodes.filter(n => rightDesc.has(n.id) || n.id === root.id);

  const leftEdges = edges.filter(e => leftDesc.has(e.target));
  const rightEdges = edges.filter(e => rightDesc.has(e.target));

  // Layout Left
  const layoutedLeft = getLayoutedElements(leftNodes, leftEdges, 'RL');
  const rootLeft = layoutedLeft.nodes.find(n => n.id === root.id);
  const offsetLeftX = rootLeft ? -rootLeft.position.x : 0;
  const offsetLeftY = rootLeft ? -rootLeft.position.y : 0;

  layoutedLeft.nodes.forEach(n => {
    n.position.x += offsetLeftX;
    n.position.y += offsetLeftY;
    if (n.id !== root.id) {
      n.data = { ...n.data, direction: 'left' };
    }
  });

  leftEdges.forEach(e => {
    e.sourceHandle = 'source-left';
    e.targetHandle = 'target-right';
  });

  // Layout Right
  const layoutedRight = getLayoutedElements(rightNodes, rightEdges, 'LR');
  const rootRight = layoutedRight.nodes.find(n => n.id === root.id);
  const offsetRightX = rootRight ? -rootRight.position.x : 0;
  const offsetRightY = rootRight ? -rootRight.position.y : 0;

  layoutedRight.nodes.forEach(n => {
    n.position.x += offsetRightX;
    n.position.y += offsetRightY;
    if (n.id !== root.id) {
      n.data = { ...n.data, direction: 'right' };
    }
  });

  rightEdges.forEach(e => {
    e.sourceHandle = 'source-right';
    e.targetHandle = 'target-left';
  });

  // Combine
  const combinedNodesMap = new Map<string, Node>();
  layoutedLeft.nodes.forEach(n => combinedNodesMap.set(n.id, n));
  layoutedRight.nodes.forEach(n => combinedNodesMap.set(n.id, n)); // Override root with right's root (which is 0,0 anyway)

  return {
    nodes: Array.from(combinedNodesMap.values()),
    edges: edges // original edges are fine
  };
}

const BRANCH_COLORS = [
  '#FFB3BA', // Pastel Red
  '#FFDFBA', // Pastel Orange
  '#BAFFC9', // Pastel Green
  '#BAE1FF', // Pastel Blue
  '#E2BAFF', // Pastel Purple
  '#FFC2E2', // Pastel Pink
];

// Màu dây (stroke) đậm hơn tương ứng với các nhánh
const STROKE_COLORS = [
  '#EF4444', // Darker Red
  '#F97316', // Darker Orange
  '#22C55E', // Darker Green
  '#3B82F6', // Darker Blue
  '#A855F7', // Darker Purple
  '#EC4899', // Darker Pink
];

// Hàm tự động tô màu các nhánh và đường nối
export function applyMindmapStyles(nodes: Node[], edges: Edge[]) {
  const targets = new Set(edges.map(e => e.target));
  const root = nodes.find(n => !targets.has(n.id));
  if (!root) return { nodes, edges };

  const newNodes = nodes.map(n => ({ ...n, data: { ...n.data } }));
  const newEdges = edges.map(e => ({ ...e }));

  const rootIndex = newNodes.findIndex(n => n.id === root.id);
  // Do not set branchColor for root so it falls back to theme.bg (default styling)

  const adj = new Map<string, string[]>();
  newEdges.forEach(e => {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source)!.push(e.target);
  });

  const chapters = adj.get(root.id) || [];
  chapters.forEach((chapterId, index) => {
    const color = BRANCH_COLORS[index % BRANCH_COLORS.length];
    const strokeColor = STROKE_COLORS[index % STROKE_COLORS.length];

    const queue = [chapterId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      const nodeIndex = newNodes.findIndex(n => n.id === current);
      if (nodeIndex !== -1) {
        newNodes[nodeIndex].data.branchColor = color;
        newNodes[nodeIndex].data.strokeColor = strokeColor;
      }
      const children = adj.get(current) || [];
      queue.push(...children);
    }
  });

  newEdges.forEach(edge => {
    const targetNode = newNodes.find(n => n.id === edge.target);
    const stroke = (targetNode?.data?.strokeColor as string) || '#94a3b8';
    
    edge.type = 'default'; // Bezier curve
    edge.animated = false;
    edge.style = {
      ...edge.style,
      stroke: stroke,
      strokeWidth: 3,
      filter: 'drop-shadow(3px 3px 4px rgba(0,0,0,0.3))',
    };
  });

  return { nodes: newNodes, edges: newEdges };
}
