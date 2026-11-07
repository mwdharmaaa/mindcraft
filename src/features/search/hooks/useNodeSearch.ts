import { useState, useMemo } from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { filterNodes } from '../utils/searchFilter';

export function useNodeSearch() {
  const nodes = useMindMapStore((s) => s.nodes);
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    return filterNodes(nodes, query);
  }, [nodes, query]);

  return {
    query,
    setQuery,
    matches,
    totalCount: nodes.length,
  };
}
