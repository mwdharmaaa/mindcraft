import { Node, Edge, Position } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';
import { runMindMapLayout } from '@/features/layout/layoutEngine';

export function serializeToOpml(nodes: Node<MindNodeData>[], edges: Edge[]): string {
  const root = nodes.find((n) => n.data.kind === 'root') || nodes[0];
  if (!root) return '';

  const childrenMap = new Map<string, string[]>();
  edges.forEach((edge) => {
    const list = childrenMap.get(edge.source) || [];
    list.push(edge.target);
    childrenMap.set(edge.source, list);
  });

  const renderOutline = (nodeId: string, depth: number): string => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return '';

    const indent = '  '.repeat(depth);
    const childIds = childrenMap.get(nodeId) || [];
    const textAttr = (node.data.label || 'Untitled').replace(/"/g, '&quot;');

    if (childIds.length === 0) {
      return `${indent}<outline text="${textAttr}" />`;
    }

    const childrenXml = childIds.map((cid) => renderOutline(cid, depth + 1)).join('\n');
    return `${indent}<outline text="${textAttr}">\n${childrenXml}\n${indent}</outline>`;
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${(root.data.label || 'MindCraft Map').replace(/"/g, '&quot;')}</title>
    <dateCreated>${new Date().toUTCString()}</dateCreated>
  </head>
  <body>
${renderOutline(root.id, 2)}
  </body>
</opml>`;
}

export function deserializeFromOpml(
  opmlXml: string
): { nodes: Node<MindNodeData>[]; edges: Edge[] } | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(opmlXml, 'text/xml');
  const body = doc.querySelector('body');
  if (!body) return null;

  const rootOutline = body.querySelector('outline');
  if (!rootOutline) return null;

  const nodes: Node<MindNodeData>[] = [];
  const edges: Edge[] = [];

  const traverse = (el: Element, parentId: string | null, depth: number) => {
    const text = el.getAttribute('text') || el.getAttribute('title') || 'Untitled';
    const id = `opml-${Date.now()}-${nodes.length}`;
    const isRoot = parentId === null;

    const node: Node<MindNodeData> = {
      id,
      type: isRoot ? 'root' : 'topic',
      position: { x: depth * 260, y: nodes.length * 80 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        label: text,
        kind: isRoot ? 'root' : 'topic',
        color: isRoot ? '#f4f4f5' : '#d4d4d8',
        priority: 'none',
        parentId,
      },
    };

    nodes.push(node);

    if (parentId) {
      edges.push({
        id: `e-${parentId}-${id}`,
        source: parentId,
        target: id,
        sourceHandle: 'source-r',
        targetHandle: 'target-l',
        type: 'smoothstep',
        style: { stroke: '#71717a', strokeWidth: 1.5 },
      });
    }

    const children = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === 'outline');
    children.forEach((child) => traverse(child, id, depth + 1));
  };

  traverse(rootOutline, null, 0);

  return runMindMapLayout(nodes, edges, 'LR');
}
