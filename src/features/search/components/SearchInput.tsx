import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/90">
      <Search className="w-4 h-4 text-zinc-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search cards by title, tag, checklist, or documentation..."
        autoFocus
        className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
      />
      {value && (
        <button
          onClick={onClear}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
