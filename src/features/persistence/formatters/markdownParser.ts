import { Node, Edge } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export function serializeToMarkdown(nodes: Node<MindNodeData>[], edges: Edge[]): string {
  if (nodes.length === 0) return '';

  const root = nodes.find((n) => n.data.kind === 'root') || nodes[0];
  const childrenMap = new Map<string, string[]>();

  edges.forEach((edge) => {
    const list = childrenMap.get(edge.source) || [];
    list.push(edge.target);
    childrenMap.set(edge.source, list);
  });

  const lines: string[] = [`# ${root.data.label}`];

  const traverse = (nodeId: string, depth: number) => {
    const childIds = childrenMap.get(nodeId) || [];
    childIds.forEach((cid) => {
      const child = nodes.find((n) => n.id === cid);
      if (!child) return;

      const indent = '  '.repeat(depth);
      if (child.data.kind === 'checklist') {
        lines.push(`${indent}- [ ] ${child.data.label}`);
        (child.data.checklist || []).forEach((item) => {
          lines.push(`${indent}  - [${item.completed ? 'x' : ' '}] ${item.text}`);
        });
      } else if (child.data.kind === 'markdown' && child.data.markdown) {
        lines.push(`${indent}- **${child.data.label}**: ${child.data.markdown}`);
      } else {
        lines.push(`${indent}- ${child.data.label}`);
      }

      traverse(cid, depth + 1);
    });
  };

  traverse(root.id, 0);
  return lines.join('\n');
}
