import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge } from '@xyflow/react';
import { MindMapStoreState, ConnectorType } from './mindMapStore.types';
import { initialNodes, initialEdges } from './initialTemplate';
import { getAllDescendantIds, buildEdge, createNewChildNode } from './treeHelpers';
import { runMindMapLayout } from '@/features/layout/layoutEngine';
import { MindNodeData } from '@/features/nodes/types/node.types';

function optimizeEdgeHandles(nodes: Node<MindNodeData>[], edges: Edge[]): Edge[] {
  const nodeMap = new Map<string, { x: number; y: number }>();
  nodes.forEach((n) => nodeMap.set(n.id, n.position));

  return edges.map((edge) => {
    const sPos = nodeMap.get(edge.source);
    const tPos = nodeMap.get(edge.target);
    if (!sPos || !tPos) return edge;

    const dx = tPos.x - sPos.x;
    const dy = tPos.y - sPos.y;

    let sourceHandle = 'source-r';
    let targetHandle = 'target-l';

    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx < 0) {
        sourceHandle = 'source-l';
        targetHandle = 'target-r';
      } else {
        sourceHandle = 'source-r';
        targetHandle = 'target-l';
      }
    } else {
      if (dy < 0) {
        sourceHandle = 'source-t';
        targetHandle = 'target-b';
      } else {
        sourceHandle = 'source-b';
        targetHandle = 'target-t';
      }
    }

    if (edge.sourceHandle === sourceHandle && edge.targetHandle === targetHandle) {
      return edge;
    }

    return {
      ...edge,
      sourceHandle,
      targetHandle,
    };
  });
}

export const useMindMapStore = create<MindMapStoreState>((set, get) => ({
  nodes: initialNodes,
  edges: optimizeEdgeHandles(initialNodes, initialEdges),
  selectedNodeId: null,
  layoutDirection: 'LR',
  connectorType: 'smoothstep',
  history: [{ nodes: initialNodes, edges: initialEdges }],
  historyIndex: 0,

  onNodesChange: (changes) => {
    const nextNodes = applyNodeChanges(changes, get().nodes);
    const hasPositionChange = changes.some((c) => c.type === 'position');
    const nextEdges = hasPositionChange ? optimizeEdgeHandles(nextNodes, get().edges) : get().edges;
    set({ nodes: nextNodes, edges: nextEdges });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const nextEdges = optimizeEdgeHandles(get().nodes, addEdge(connection, get().edges));
    set({ edges: nextEdges });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, partialData) => {
    const nextNodes = get().nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...partialData } } : node
    );
    set({ nodes: nextNodes });
  },

  addChildNode: (parentId) => {
    const state = get();
    const pid = parentId || state.selectedNodeId || state.nodes[0]?.id;
    if (!pid) return;

    const parent = state.nodes.find((n) => n.id === pid);
    if (!parent) return;

    // Organic offset placement: freely places child near parent without touching any existing nodes
    const existingChildren = state.edges.filter((e) => e.source === pid);
    const count = existingChildren.length;

    // Fan-out offset (staggers children neatly in open space)
    const offsetX = 250;
    const offsetY = count === 0 ? 0 : count % 2 === 1 ? Math.ceil(count / 2) * 80 : -Math.ceil(count / 2) * 80;
    const targetPos = {
      x: parent.position.x + offsetX,
      y: parent.position.y + offsetY,
    };

    const newNode = createNewChildNode(pid, parent, 'topic', targetPos);
    const rawEdge = buildEdge(pid, newNode.id, state.connectorType, parent.data.color, parent.position, targetPos);

    const nextNodes = [...state.nodes, newNode];
    const nextEdges = optimizeEdgeHandles(nextNodes, [...state.edges, rawEdge]);

    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedNodeId: newNode.id,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: nextNodes, edges: nextEdges },
      ],
      historyIndex: state.historyIndex + 1,
    });
  },

  addSiblingNode: (nodeId) => {
    const state = get();
    const targetId = nodeId || state.selectedNodeId;
    if (!targetId) return;

    const targetNode = state.nodes.find((n) => n.id === targetId);
    if (!targetNode || !targetNode.data.parentId) return;

    const parent = state.nodes.find((n) => n.id === targetNode.data.parentId);
    if (!parent) return;

    // Place sibling directly below current target node
    const targetPos = {
      x: targetNode.position.x,
      y: targetNode.position.y + 80,
    };

    const newNode = createNewChildNode(parent.id, parent, 'topic', targetPos);
    const rawEdge = buildEdge(parent.id, newNode.id, state.connectorType, parent.data.color, parent.position, targetPos);

    const nextNodes = [...state.nodes, newNode];
    const nextEdges = optimizeEdgeHandles(nextNodes, [...state.edges, rawEdge]);

    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedNodeId: newNode.id,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: nextNodes, edges: nextEdges },
      ],
      historyIndex: state.historyIndex + 1,
    });
  },

  deleteSubtree: (nodeId) => {
    const state = get();
    const targetNode = state.nodes.find((n) => n.id === nodeId);
    if (!targetNode || targetNode.data.kind === 'root') return;

    const toDelete = getAllDescendantIds(nodeId, state.edges);
    toDelete.add(nodeId);

    const nextNodes = state.nodes.filter((n) => !toDelete.has(n.id));
    const nextEdges = state.edges.filter((e) => !toDelete.has(e.source) && !toDelete.has(e.target));

    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedNodeId: null,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: nextNodes, edges: nextEdges },
      ],
      historyIndex: state.historyIndex + 1,
    });
  },

  toggleCollapse: (nodeId) => {
    const state = get();
    const targetNode = state.nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    const isCollapsed = !targetNode.data.collapsed;
    const descendantIds = getAllDescendantIds(nodeId, state.edges);

    const nextNodes = state.nodes.map((n) => {
      if (n.id === nodeId) return { ...n, data: { ...n.data, collapsed: isCollapsed } };
      if (descendantIds.has(n.id)) return { ...n, hidden: isCollapsed };
      return n;
    });

    const nextEdges = state.edges.map((e) => {
      if (descendantIds.has(e.target)) return { ...e, hidden: isCollapsed };
      return e;
    });

    set({ nodes: nextNodes, edges: nextEdges });
  },

  applyLayout: (direction) => {
    const state = get();
    const nextDir = direction || state.layoutDirection;
    const layoutResult = runMindMapLayout(state.nodes, state.edges, nextDir);

    set({
      nodes: layoutResult.nodes,
      edges: layoutResult.edges,
      layoutDirection: nextDir,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: layoutResult.nodes, edges: layoutResult.edges },
      ],
      historyIndex: state.historyIndex + 1,
    });
  },

  setConnectorType: (type: ConnectorType) => {
    const nextEdges = get().edges.map((e) => ({ ...e, type }));
    set({ edges: nextEdges, connectorType: type });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1 });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1 });
    }
  },

  resetCanvas: () => {
    set({
      nodes: initialNodes,
      edges: initialEdges,
      selectedNodeId: null,
      history: [{ nodes: initialNodes, edges: initialEdges }],
      historyIndex: 0,
    });
  },

  importMindMap: (nodes, edges) => {
    set({
      nodes,
      edges,
      selectedNodeId: null,
      history: [{ nodes, edges }],
      historyIndex: 0,
    });
  },
}));
