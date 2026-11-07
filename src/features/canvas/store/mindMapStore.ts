import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge } from '@xyflow/react';
import { MindMapStoreState, ConnectorType } from './mindMapStore.types';
import { initialNodes, initialEdges } from './initialTemplate';
import {
  getAllDescendantIds,
  buildEdge,
  createNewChildNode,
  calculateChildPosition,
  calculateSiblingPosition,
} from './treeHelpers';
import { runMindMapLayout } from '@/features/layout/layoutEngine';
import { MindNodeData } from '@/features/nodes/types/node.types';
import { optimizeEdgeHandles } from './edgeHelpers';
import { loadPersistedCanvas, persistCanvas } from './canvasPersistence';
import { cloneSubtree } from '@/features/clipboard/utils/cloneSubtree';

const initialLoaded = loadPersistedCanvas();
const defaultNodes = initialLoaded ? initialLoaded.nodes : initialNodes;
const defaultEdges = initialLoaded ? initialLoaded.edges : optimizeEdgeHandles(initialNodes, initialEdges);

export const useMindMapStore = create<MindMapStoreState>((set, get) => ({
  nodes: defaultNodes,
  edges: defaultEdges,
  selectedNodeId: null,
  layoutDirection: 'LR',
  connectorType: 'smoothstep',
  history: [{ nodes: defaultNodes, edges: defaultEdges }],
  historyIndex: 0,
  lastSavedAt: initialLoaded ? Date.now() : null,
  isSearchOpen: false,
  clipboard: null,

  onNodesChange: (changes) => {
    const nextNodes = applyNodeChanges(changes, get().nodes);
    const hasPositionChange = changes.some((c) => c.type === 'position');
    const nextEdges = hasPositionChange ? optimizeEdgeHandles(nextNodes, get().edges) : get().edges;
    persistCanvas(nextNodes, nextEdges);
    set({ nodes: nextNodes, edges: nextEdges, lastSavedAt: Date.now() });
  },

  onEdgesChange: (changes) => {
    const nextEdges = applyEdgeChanges(changes, get().edges);
    persistCanvas(get().nodes, nextEdges);
    set({ edges: nextEdges, lastSavedAt: Date.now() });
  },

  onConnect: (connection) => {
    const nextEdges = optimizeEdgeHandles(get().nodes, addEdge(connection, get().edges));
    persistCanvas(get().nodes, nextEdges);
    set({ edges: nextEdges, lastSavedAt: Date.now() });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, partialData) => {
    const nextNodes = get().nodes.map((node) => {
      if (node.id !== id) return node;
      const nextType = partialData.kind ? partialData.kind : node.type;
      return {
        ...node,
        type: nextType,
        data: {
          ...node.data,
          ...partialData,
        },
      };
    });
    persistCanvas(nextNodes, get().edges);
    set({ nodes: nextNodes, lastSavedAt: Date.now() });
  },

  addChildNode: (parentId) => {
    const state = get();
    const pid = parentId || state.selectedNodeId || state.nodes[0]?.id;
    if (!pid) return;

    const parent = state.nodes.find((n) => n.id === pid);
    if (!parent) return;

    const existingChildren = state.edges.filter((e) => e.source === pid);
    const targetPos = calculateChildPosition(parent, existingChildren.length);
    const newNode = createNewChildNode(pid, parent, 'topic', targetPos);
    const rawEdge = buildEdge(pid, newNode.id, state.connectorType, parent.data.color, parent.position, targetPos);

    const nextNodes = [...state.nodes, newNode];
    const nextEdges = optimizeEdgeHandles(nextNodes, [...state.edges, rawEdge]);
    persistCanvas(nextNodes, nextEdges);

    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedNodeId: newNode.id,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: nextNodes, edges: nextEdges },
      ],
      historyIndex: state.historyIndex + 1,
      lastSavedAt: Date.now(),
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

    const targetPos = calculateSiblingPosition(targetNode);
    const newNode = createNewChildNode(parent.id, parent, 'topic', targetPos);
    const rawEdge = buildEdge(parent.id, newNode.id, state.connectorType, parent.data.color, parent.position, targetPos);

    const nextNodes = [...state.nodes, newNode];
    const nextEdges = optimizeEdgeHandles(nextNodes, [...state.edges, rawEdge]);
    persistCanvas(nextNodes, nextEdges);

    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedNodeId: newNode.id,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: nextNodes, edges: nextEdges },
      ],
      historyIndex: state.historyIndex + 1,
      lastSavedAt: Date.now(),
    });
  },

  addCardAtPosition: (position, kind = 'topic') => {
    const state = get();
    const newId = `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const selectedParent = state.selectedNodeId
      ? state.nodes.find((n) => n.id === state.selectedNodeId)
      : null;

    const cardColor = selectedParent?.data.color || '#d4d4d8';

    const newNode: Node<MindNodeData> = {
      id: newId,
      type: kind,
      position,
      data: {
        label: '',
        kind,
        color: cardColor,
        parentId: selectedParent?.id,
        shape: 'rounded',
        priority: 'none',
        checklist: [],
        markdown: '',
      },
    };

    let nextEdges = state.edges;
    if (selectedParent) {
      const rawEdge = buildEdge(
        selectedParent.id,
        newId,
        state.connectorType,
        '#71717a',
        selectedParent.position,
        position
      );
      nextEdges = optimizeEdgeHandles([...state.nodes, newNode], [...state.edges, rawEdge]);
    }

    const nextNodes = [...state.nodes, newNode];
    persistCanvas(nextNodes, nextEdges);

    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedNodeId: newId,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: nextNodes, edges: nextEdges },
      ],
      historyIndex: state.historyIndex + 1,
      lastSavedAt: Date.now(),
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
    persistCanvas(nextNodes, nextEdges);

    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedNodeId: null,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: nextNodes, edges: nextEdges },
      ],
      historyIndex: state.historyIndex + 1,
      lastSavedAt: Date.now(),
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

    persistCanvas(nextNodes, nextEdges);
    set({ nodes: nextNodes, edges: nextEdges, lastSavedAt: Date.now() });
  },

  applyLayout: (direction) => {
    const state = get();
    const nextDir = direction || state.layoutDirection;
    const layoutResult = runMindMapLayout(state.nodes, state.edges, nextDir);
    persistCanvas(layoutResult.nodes, layoutResult.edges);

    set({
      nodes: layoutResult.nodes,
      edges: layoutResult.edges,
      layoutDirection: nextDir,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: layoutResult.nodes, edges: layoutResult.edges },
      ],
      historyIndex: state.historyIndex + 1,
      lastSavedAt: Date.now(),
    });
  },

  setConnectorType: (type: ConnectorType) => {
    const nextEdges = get().edges.map((e) => ({ ...e, type }));
    persistCanvas(get().nodes, nextEdges);
    set({ edges: nextEdges, connectorType: type, lastSavedAt: Date.now() });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      persistCanvas(prev.nodes, prev.edges);
      set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1, lastSavedAt: Date.now() });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      persistCanvas(next.nodes, next.edges);
      set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1, lastSavedAt: Date.now() });
    }
  },

  resetCanvas: () => {
    const nextEdges = optimizeEdgeHandles(initialNodes, initialEdges);
    persistCanvas(initialNodes, nextEdges);
    set({
      nodes: initialNodes,
      edges: nextEdges,
      selectedNodeId: null,
      history: [{ nodes: initialNodes, edges: nextEdges }],
      historyIndex: 0,
      lastSavedAt: Date.now(),
    });
  },

  createBlankCanvas: () => {
    const blankRoot: Node<MindNodeData> = {
      id: 'root-1',
      type: 'root',
      position: { x: 400, y: 300 },
      data: {
        label: 'Central Theme',
        kind: 'root',
        color: '#f4f4f5',
        priority: 'high',
      },
    };
    const nextNodes = [blankRoot];
    const nextEdges: Edge[] = [];
    persistCanvas(nextNodes, nextEdges);
    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedNodeId: 'root-1',
      history: [{ nodes: nextNodes, edges: nextEdges }],
      historyIndex: 0,
      lastSavedAt: Date.now(),
    });
  },

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  focusNode: (id) => set({ selectedNodeId: id, isSearchOpen: false }),

  duplicateSubtree: (nodeId) => {
    const state = get();
    const targetId = nodeId || state.selectedNodeId;
    if (!targetId) return;

    const targetNode = state.nodes.find((n) => n.id === targetId);
    if (!targetNode || targetNode.data.kind === 'root') return;

    const cloned = cloneSubtree(targetId, state.nodes, state.edges, { x: 40, y: 80 });
    let nextEdges = [...state.edges, ...cloned.edges];

    // If target has a parent, connect the clone root to the same parent
    const parentEdge = state.edges.find((e) => e.target === targetId);
    if (parentEdge) {
      const bridgeEdge = buildEdge(
        parentEdge.source,
        cloned.newRootId,
        state.connectorType,
        targetNode.data.color,
        state.nodes.find((n) => n.id === parentEdge.source)?.position,
        cloned.nodes.find((n) => n.id === cloned.newRootId)?.position
      );
      nextEdges.push(bridgeEdge);
    }

    const nextNodes = [...state.nodes, ...cloned.nodes];
    const optimizedEdges = optimizeEdgeHandles(nextNodes, nextEdges);
    persistCanvas(nextNodes, optimizedEdges);

    set({
      nodes: nextNodes,
      edges: optimizedEdges,
      selectedNodeId: cloned.newRootId,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: nextNodes, edges: optimizedEdges },
      ],
      historyIndex: state.historyIndex + 1,
      lastSavedAt: Date.now(),
    });
  },

  copySubtree: (nodeId) => {
    const state = get();
    const targetId = nodeId || state.selectedNodeId;
    if (!targetId) return;

    const descendantIds = getAllDescendantIds(targetId, state.edges);
    const targetIds = new Set<string>([targetId, ...descendantIds]);

    const subNodes = state.nodes.filter((n) => targetIds.has(n.id));
    const subEdges = state.edges.filter((e) => targetIds.has(e.source) && targetIds.has(e.target));

    set({
      clipboard: {
        rootId: targetId,
        nodes: subNodes,
        edges: subEdges,
        copiedAt: Date.now(),
      },
    });
  },

  pasteSubtree: (targetParentId) => {
    const state = get();
    if (!state.clipboard) return;

    const parentId = targetParentId || state.selectedNodeId;
    const parentNode = parentId ? state.nodes.find((n) => n.id === parentId) : null;

    const cloned = cloneSubtree(
      state.clipboard.rootId,
      state.clipboard.nodes,
      state.clipboard.edges,
      { x: parentNode ? 240 : 60, y: parentNode ? 40 : 60 }
    );

    let nextEdges = [...state.edges, ...cloned.edges];

    if (parentNode) {
      const bridgeEdge = buildEdge(
        parentNode.id,
        cloned.newRootId,
        state.connectorType,
        parentNode.data.color,
        parentNode.position,
        cloned.nodes.find((n) => n.id === cloned.newRootId)?.position
      );
      nextEdges.push(bridgeEdge);
    }

    const nextNodes = [...state.nodes, ...cloned.nodes];
    const optimizedEdges = optimizeEdgeHandles(nextNodes, nextEdges);
    persistCanvas(nextNodes, optimizedEdges);

    set({
      nodes: nextNodes,
      edges: optimizedEdges,
      selectedNodeId: cloned.newRootId,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: nextNodes, edges: optimizedEdges },
      ],
      historyIndex: state.historyIndex + 1,
      lastSavedAt: Date.now(),
    });
  },

  importMindMap: (nodes, edges) => {
    const nextEdges = optimizeEdgeHandles(nodes, edges);
    persistCanvas(nodes, nextEdges);
    set({
      nodes,
      edges: nextEdges,
      selectedNodeId: null,
      history: [{ nodes, edges: nextEdges }],
      historyIndex: 0,
      lastSavedAt: Date.now(),
    });
  },
}));
