import { Node, Edge, Position } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export function calculateRadialLayout(
  nodes: Node<MindNodeData>[],
  edges: Edge[]
): { nodes: Node<MindNodeData>[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes, edges };

  const root = nodes.find((n) => n.data.kind === 'root') || nodes[0];
  const childrenMap = new Map<string, string[]>();

  edges.forEach((edge) => {
    const list = childrenMap.get(edge.source) || [];
    list.push(edge.target);
    childrenMap.set(edge.source, list);
  });

  const positionMap = new Map<string, { x: number; y: number }>();
  positionMap.set(root.id, { x: 0, y: 0 });

  const rootChildren = childrenMap.get(root.id) || [];
  const rootCount = rootChildren.length;

  const layoutSubtree = (
    nodeId: string,
    depth: number,
    startAngle: number,
    endAngle: number
  ) => {
    const children = childrenMap.get(nodeId) || [];
    if (children.length === 0) return;

    const radius = 220 + depth * 180;
    const angleStep = (endAngle - startAngle) / children.length;

    children.forEach((childId, index) => {
      const childAngle = startAngle + angleStep * (index + 0.5);
      const x = radius * Math.cos(childAngle);
      const y = radius * Math.sin(childAngle);
      positionMap.set(childId, { x, y });

      const subStart = startAngle + angleStep * index;
      const subEnd = startAngle + angleStep * (index + 1);
      layoutSubtree(childId, depth + 1, subStart, subEnd);
    });
  };

  if (rootCount > 0) {
    const angleSlice = (2 * Math.PI) / rootCount;
    rootChildren.forEach((childId, index) => {
      const angle = index * angleSlice;
      const radius = 240;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      positionMap.set(childId, { x, y });

      layoutSubtree(
        childId,
        1,
        angle - angleSlice / 2,
        angle + angleSlice / 2
      );
    });
  }

  const layoutedNodes = nodes.map((node) => {
    const pos = positionMap.get(node.id) || { x: node.position.x, y: node.position.y };
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: pos,
    };
  });

  return { nodes: layoutedNodes, edges };
}
