import { Node } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export interface SearchMatch {
  node: Node<MindNodeData>;
  matchField: 'label' | 'tags' | 'checklist' | 'markdown';
  matchSnippet: string;
}

export interface SearchFilterState {
  query: string;
  selectedKind?: string;
  selectedPriority?: string;
}
