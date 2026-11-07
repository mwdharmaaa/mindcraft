import { Node, Edge } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export function optimizeEdgeHandles(nodes: Node<MindNodeData>[], edges: Edge[]): Edge[] {
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
