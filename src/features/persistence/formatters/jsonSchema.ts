import { Node, Edge } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export interface MindMapExportPayload {
  version: string;
  exportedAt: string;
  nodes: Node<MindNodeData>[];
  edges: Edge[];
}

export function serializeToJson(nodes: Node<MindNodeData>[], edges: Edge[]): string {
  const payload: MindMapExportPayload = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    nodes,
    edges,
  };
  return JSON.stringify(payload, null, 2);
}

export function deserializeFromJson(jsonString: string): MindMapExportPayload | null {
  try {
    const data = JSON.parse(jsonString) as MindMapExportPayload;
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
