import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export function calculateDagreLayout(
  nodes: Node<MindNodeData>[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: Node<MindNodeData>[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 40,
    ranksep: 90,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    const width = node.data.kind === 'checklist' ? 260 : 210;
    const height = node.data.kind === 'checklist' ? 150 : 75;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const targetPosition = isHorizontal ? Position.Left : Position.Top;
  const sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.data.kind === 'checklist' ? 260 : 210;
    const height = node.data.kind === 'checklist' ? 150 : 75;

    return {
      ...node,
      targetPosition,
      sourcePosition,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
