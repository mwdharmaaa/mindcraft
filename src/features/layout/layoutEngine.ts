import { Node, Edge } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';
import { LayoutDirection } from '@/features/canvas/store/mindMapStore.types';
import { calculateDagreLayout } from './algorithms/dagreTreeLayout';
import { calculateRadialLayout } from './algorithms/radialLayout';

export function runMindMapLayout(
  nodes: Node<MindNodeData>[],
  edges: Edge[],
  direction: LayoutDirection
): { nodes: Node<MindNodeData>[]; edges: Edge[] } {
  if (direction === 'RADIAL') {
    return calculateRadialLayout(nodes, edges);
  }
  return calculateDagreLayout(nodes, edges, direction);
}
