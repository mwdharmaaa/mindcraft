import React, { useState, useEffect } from 'react';
import { useNodeSearch } from '../hooks/useNodeSearch';
import { SearchInput } from './SearchInput';
import { SearchResultsList } from './SearchResultsList';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { query, setQuery, matches } = useNodeSearch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const setSelectedNodeId = useMindMapStore((s) => s.setSelectedNodeId);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (matches[selectedIndex]) {
        setSelectedNodeId(matches[selectedIndex].node.id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
        <SearchResultsList
          matches={matches}
          selectedIndex={selectedIndex}
          query={query}
          onSelectMatch={(match) => {
            setSelectedNodeId(match.node.id);
            onClose();
          }}
        />
        <div className="px-4 py-2 bg-zinc-950/70 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Navigate with &uarr; &darr;, Enter to jump</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
