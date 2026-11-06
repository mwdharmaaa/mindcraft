export type NodeTypeKind = 'root' | 'topic' | 'checklist' | 'markdown';

export type NodeShape = 'rounded' | 'pill' | 'rectangle' | 'minimal';

export type NodeBorderStyle = 'solid' | 'dashed' | 'dotted';

export type NodePriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface MindNodeData {
  label: string;
  kind: NodeTypeKind;
  shape?: NodeShape;
  color?: string;
  borderStyle?: NodeBorderStyle;
  collapsed?: boolean;
  checklist?: ChecklistItem[];
  markdown?: string;
  tags?: string[];
  priority?: NodePriority;
  parentId?: string | null;
  [key: string]: unknown;
}
