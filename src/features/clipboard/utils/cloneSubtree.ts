import { Node, Edge } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';
import { getAllDescendantIds } from '@/features/canvas/store/treeHelpers';

export function cloneSubtree(
  sourceRootId: string,
  allNodes: Node<MindNodeData>[],
  allEdges: Edge[],
  offset: { x: number; y: number } = { x: 50, y: 50 }
): { newRootId: string; nodes: Node<MindNodeData>[]; edges: Edge[] } {
  const descendantIds = getAllDescendantIds(sourceRootId, allEdges);
  const targetIds = new Set<string>([sourceRootId, ...descendantIds]);

  const subtreeNodes = allNodes.filter((n) => targetIds.has(n.id));
  const subtreeEdges = allEdges.filter((e) => targetIds.has(e.source) && targetIds.has(e.target));

  const idMap = new Map<string, string>();
  const timestamp = Date.now();

  subtreeNodes.forEach((node, idx) => {
    idMap.set(node.id, `clone-${timestamp}-${idx}-${Math.floor(Math.random() * 1000)}`);
  });

  const clonedNodes: Node<MindNodeData>[] = subtreeNodes.map((node) => {
    const newId = idMap.get(node.id)!;
    const isRootOfClone = node.id === sourceRootId;

    return {
      ...node,
      id: newId,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      data: {
        ...node.data,
        parentId: isRootOfClone ? undefined : node.data.parentId ? idMap.get(node.data.parentId) : undefined,
      },
    };
  });

  const clonedEdges: Edge[] = subtreeEdges.map((edge) => {
    const newSource = idMap.get(edge.source)!;
    const newTarget = idMap.get(edge.target)!;

    return {
      ...edge,
      id: `e-${newSource}-${newTarget}-${timestamp}`,
      source: newSource,
      target: newTarget,
    };
  });

  return {
    newRootId: idMap.get(sourceRootId)!,
    nodes: clonedNodes,
    edges: clonedEdges,
  };
}
