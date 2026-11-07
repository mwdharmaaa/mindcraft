import { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';
import { ClipboardSubtree } from '@/features/clipboard/types/clipboard.types';

export type LayoutDirection = 'LR' | 'TB' | 'RADIAL';
export type ConnectorType = 'bezier' | 'straight' | 'smoothstep';

export interface MindMapHistoryItem {
  nodes: Node<MindNodeData>[];
  edges: Edge[];
}

export interface MindMapStoreState {
  nodes: Node<MindNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  layoutDirection: LayoutDirection;
  connectorType: ConnectorType;
  history: MindMapHistoryItem[];
  historyIndex: number;
  lastSavedAt: number | null;
  activeProjectId: string;
  isProjectModalOpen: boolean;
  isSearchOpen: boolean;
  clipboard: ClipboardSubtree | null;

  onNodesChange: OnNodesChange<Node<MindNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<MindNodeData>) => void;
  addChildNode: (parentId?: string) => void;
  addSiblingNode: (nodeId?: string) => void;
  addCardAtPosition: (position: { x: number; y: number }, kind?: 'topic' | 'checklist' | 'markdown') => void;
  deleteSubtree: (nodeId: string) => void;
  toggleCollapse: (nodeId: string) => void;
  applyLayout: (direction?: LayoutDirection) => void;
  setConnectorType: (type: ConnectorType) => void;
  undo: () => void;
  redo: () => void;
  resetCanvas: () => void;
  createBlankCanvas: () => void;
  importMindMap: (nodes: Node<MindNodeData>[], edges: Edge[]) => void;
  openSearch: () => void;
  closeSearch: () => void;
  focusNode: (id: string) => void;
  deleteEdge: (edgeId: string) => void;
  openProjectModal: () => void;
  closeProjectModal: () => void;
  switchProject: (projectId: string) => void;
  createProject: (name: string) => void;
  deleteProject: (projectId: string) => void;
  duplicateSubtree: (nodeId?: string) => void;
  copySubtree: (nodeId?: string) => void;
  pasteSubtree: (targetParentId?: string) => void;
}
