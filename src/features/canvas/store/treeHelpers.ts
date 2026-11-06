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
  color = '#71717a',
  sourcePos?: { x: number; y: number },
  targetPos?: { x: number; y: number }
): Edge {
  let sourceHandle = 'source-r';
  let targetHandle = 'target-l';

  if (sourcePos && targetPos) {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;

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
  }

  return {
    id: `e-${sourceId}-${targetId}-${Date.now()}`,
    source: sourceId,
    target: targetId,
    sourceHandle,
    targetHandle,
    type: connectorType,
    style: { stroke: color, strokeWidth: 1.5 },
  };
}

export function createNewChildNode(
  parentId: string,
  parent: Node<MindNodeData>,
  kind: 'topic' | 'checklist' | 'markdown' = 'topic',
  customPos?: { x: number; y: number }
): Node<MindNodeData> {
  const newId = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const parentColor = parent.data.color || '#d4d4d8';

  return {
    id: newId,
    type: kind,
    position: customPos || {
      x: parent.position.x + 240,
      y: parent.position.y + 40,
    },
    data: {
      label: '',
      kind,
      color: parentColor,
      parentId,
      shape: 'rounded',
      priority: 'none',
      checklist: [],
      markdown: '',
    },
  };
}
