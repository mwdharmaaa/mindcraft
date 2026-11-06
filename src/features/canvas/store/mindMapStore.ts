import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge } from '@xyflow/react';
import { MindMapStoreState, ConnectorType } from './mindMapStore.types';
import { initialNodes, initialEdges } from './initialTemplate';
import { getAllDescendantIds, buildEdge, createNewChildNode } from './treeHelpers';
import { runMindMapLayout } from '@/features/layout/layoutEngine';
import { MindNodeData } from '@/features/nodes/types/node.types';

export const useMindMapStore = create<MindMapStoreState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  layoutDirection: 'LR',
  connectorType: 'smoothstep',
  history: [{ nodes: initialNodes, edges: initialEdges }],
  historyIndex: 0,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const nextEdges = addEdge(connection, get().edges);
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

    const newNode = createNewChildNode(pid, parent, 'topic');
    const newEdge = buildEdge(pid, newNode.id, state.connectorType, parent.data.color);

    const nextNodes = [...state.nodes, newNode];
    const nextEdges = [...state.edges, newEdge];
    const layoutResult = runMindMapLayout(nextNodes, nextEdges, state.layoutDirection);

    set({
      nodes: layoutResult.nodes,
      edges: layoutResult.edges,
      selectedNodeId: newNode.id,
      history: [...state.history.slice(0, state.historyIndex + 1), { nodes: layoutResult.nodes, edges: layoutResult.edges }],
      historyIndex: state.historyIndex + 1,
    });
  },

  addSiblingNode: (nodeId) => {
    const state = get();
    const targetId = nodeId || state.selectedNodeId;
    if (!targetId) return;

    const targetNode = state.nodes.find((n) => n.id === targetId);
    if (!targetNode || !targetNode.data.parentId) return;

    state.addChildNode(targetNode.data.parentId);
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
      history: [...state.history.slice(0, state.historyIndex + 1), { nodes: nextNodes, edges: nextEdges }],
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
    const dir = direction || state.layoutDirection;
    const result = runMindMapLayout(state.nodes, state.edges, dir);
    set({ nodes: result.nodes, edges: result.edges, layoutDirection: dir });
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

  importMindMap: (nodes: Node<MindNodeData>[], edges: Edge[]) => {
    set({
      nodes,
      edges,
      selectedNodeId: null,
      history: [{ nodes, edges }],
      historyIndex: 0,
    });
  },
}));
