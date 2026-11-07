import { EdgeTypes } from '@xyflow/react';
import { MindMapEdge } from './components/MindMapEdge';

export const edgeTypes: EdgeTypes = {
  mindmap: MindMapEdge,
  smoothstep: MindMapEdge,
  bezier: MindMapEdge,
  straight: MindMapEdge,
};
