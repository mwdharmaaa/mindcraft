import React from 'react';
import { SearchMatch } from '../types/search.types';
import { SearchResultItem } from './SearchResultItem';

interface SearchResultsListProps {
  matches: SearchMatch[];
  selectedIndex: number;
  query: string;
  onSelectMatch: (match: SearchMatch) => void;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  matches,
  selectedIndex,
  query,
  onSelectMatch,
}) => {
  if (!query) {
    return (
      <div className="p-6 text-center text-xs text-zinc-500">
        Type to search across all cards in your map...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-zinc-500">
        No cards matching &quot;{query}&quot;
      </div>
    );
  }

  return (
    <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/30">
      {matches.map((match, idx) => (
        <SearchResultItem
          key={match.node.id}
          match={match}
          isSelected={idx === selectedIndex}
          onSelect={() => onSelectMatch(match)}
        />
      ))}
    </div>
  );
};
