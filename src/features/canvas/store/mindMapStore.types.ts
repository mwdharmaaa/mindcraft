import { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export type LayoutDirection = 'LR' | 'TB' | 'RADIAL';
export type ConnectorType = 'bezier' | 'straight' | 'smoothstep';
export type CanvasScrollMode = 'horizontal' | 'vertical' | 'free';

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
  scrollMode: CanvasScrollMode;
  history: MindMapHistoryItem[];
  historyIndex: number;

  onNodesChange: OnNodesChange<Node<MindNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<MindNodeData>) => void;
  addChildNode: (parentId?: string) => void;
  addSiblingNode: (nodeId?: string) => void;
  deleteSubtree: (nodeId: string) => void;
  toggleCollapse: (nodeId: string) => void;
  applyLayout: (direction?: LayoutDirection) => void;
  setConnectorType: (type: ConnectorType) => void;
  setScrollMode: (mode: CanvasScrollMode) => void;
  undo: () => void;
  redo: () => void;
  resetCanvas: () => void;
  importMindMap: (nodes: Node<MindNodeData>[], edges: Edge[]) => void;
}
