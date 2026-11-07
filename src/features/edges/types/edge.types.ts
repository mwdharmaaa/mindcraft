import { EdgeProps } from '@xyflow/react';

export interface MindMapEdgeData extends Record<string, unknown> {
  color?: string;
  dashed?: boolean;
  animated?: boolean;
  label?: string;
}

export type MindMapEdgeProps = EdgeProps;
