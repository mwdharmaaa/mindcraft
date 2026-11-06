import { Node, Edge } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';
import { ConnectorType } from './mindMapStore.types';

export function getAllDescendantIds(nodeId: string, edges: Edge[]): Set<string> {
  const descendants = new Set<string>();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    edges.forEach((edge) => {
      if (edge.source === current && !descendants.has(edge.target)) {
        descendants.add(edge.target);
        queue.push(edge.target);
      }
    });
  }

  return descendants;
}

export function buildEdge(
  sourceId: string,
  targetId: string,
  connectorType: ConnectorType,
  color = '#64748b'
): Edge {
  return {
    id: `e-${sourceId}-${targetId}-${Date.now()}`,
    source: sourceId,
    target: targetId,
    type: connectorType,
    style: { stroke: color, strokeWidth: 1.5 },
  };
}

export function createNewChildNode(
  parentId: string,
  parent: Node<MindNodeData>,
  kind: 'topic' | 'checklist' | 'markdown' = 'topic'
): Node<MindNodeData> {
  const newId = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const parentColor = parent.data.color || '#3b82f6';

  return {
    id: newId,
    type: kind,
    position: {
      x: parent.position.x + 280,
      y: parent.position.y + (Math.random() * 80 - 40),
    },
    data: {
      label: kind === 'checklist' ? 'New Checklist' : kind === 'markdown' ? 'New Note' : 'New Topic',
      kind,
      color: parentColor,
      parentId,
      shape: 'rounded',
      priority: 'none',
    },
  };
}
