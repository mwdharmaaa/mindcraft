import { Node, Edge } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export interface ClipboardSubtree {
  rootId: string;
  nodes: Node<MindNodeData>[];
  edges: Edge[];
  copiedAt: number;
}
