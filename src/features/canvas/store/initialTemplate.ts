import { Node, Edge, Position } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export const initialNodes: Node<MindNodeData>[] = [
  {
    id: 'root-1',
    type: 'root',
    position: { x: 400, y: 300 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'MindCraft System',
      kind: 'root',
      color: '#3b82f6',
      priority: 'urgent',
    },
  },
  {
    id: 'topic-1',
    type: 'topic',
    position: { x: 700, y: 180 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Core Architecture',
      kind: 'topic',
      color: '#10b981',
      shape: 'rounded',
      priority: 'high',
      parentId: 'root-1',
    },
  },
  {
    id: 'checklist-1',
    type: 'checklist',
    position: { x: 1000, y: 140 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'MVP Deliverables',
      kind: 'checklist',
      color: '#10b981',
      checklist: [
        { id: '1', text: 'Infinite canvas engine', completed: true },
        { id: '2', text: 'Dynamic node types', completed: true },
        { id: '3', text: 'Keyboard shortcuts', completed: false },
      ],
      parentId: 'topic-1',
    },
  },
  {
    id: 'topic-2',
    type: 'topic',
    position: { x: 700, y: 400 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Customization Matrix',
      kind: 'topic',
      color: '#8b5cf6',
      shape: 'pill',
      priority: 'medium',
      parentId: 'root-1',
    },
  },
  {
    id: 'markdown-1',
    type: 'markdown',
    position: { x: 1000, y: 380 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: 'Theme & Style Tokens',
      kind: 'markdown',
      color: '#8b5cf6',
      markdown: 'Supports custom accent borders, connector curve algorithms, and JSON data export.',
      parentId: 'topic-2',
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e-root-topic1',
    source: 'root-1',
    target: 'topic-1',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: 'e-topic1-chk',
    source: 'topic-1',
    target: 'checklist-1',
    type: 'smoothstep',
    style: { stroke: '#10b981', strokeWidth: 1.5 },
  },
  {
    id: 'e-root-topic2',
    source: 'root-1',
    target: 'topic-2',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'e-topic2-md',
    source: 'topic-2',
    target: 'markdown-1',
    type: 'smoothstep',
    style: { stroke: '#8b5cf6', strokeWidth: 1.5 },
  },
];
