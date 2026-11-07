import { Node } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';
import { SearchMatch } from '../types/search.types';

export function filterNodes(
  nodes: Node<MindNodeData>[],
  query: string
): SearchMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchMatch[] = [];

  for (const node of nodes) {
    const data = node.data;

    // Check label
    if (data.label && data.label.toLowerCase().includes(q)) {
      results.push({
        node,
        matchField: 'label',
        matchSnippet: data.label,
      });
      continue;
    }

    // Check tags
    if (data.tags && data.tags.some((t) => t.toLowerCase().includes(q))) {
      const matchedTag = data.tags.find((t) => t.toLowerCase().includes(q));
      results.push({
        node,
        matchField: 'tags',
        matchSnippet: `#${matchedTag}`,
      });
      continue;
    }

    // Check checklist items
    if (data.checklist) {
      const matchedItem = data.checklist.find((item) => item.text.toLowerCase().includes(q));
      if (matchedItem) {
        results.push({
          node,
          matchField: 'checklist',
          matchSnippet: matchedItem.text,
        });
        continue;
      }
    }

    // Check markdown
    if (data.markdown && data.markdown.toLowerCase().includes(q)) {
      const idx = data.markdown.toLowerCase().indexOf(q);
      const start = Math.max(0, idx - 20);
      const end = Math.min(data.markdown.length, idx + q.length + 20);
      const snippet = '...' + data.markdown.substring(start, end) + '...';
      results.push({
        node,
        matchField: 'markdown',
        matchSnippet: snippet,
      });
    }
  }

  return results;
}
