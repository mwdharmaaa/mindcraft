import { NodeTypes } from '@xyflow/react';
import { RootNode } from './components/RootNode';
import { TopicNode } from './components/TopicNode';
import { ChecklistNode } from './components/ChecklistNode';
import { MarkdownNode } from './components/MarkdownNode';

export const nodeTypes: NodeTypes = {
  root: RootNode,
  topic: TopicNode,
  checklist: ChecklistNode,
  markdown: MarkdownNode,
};
