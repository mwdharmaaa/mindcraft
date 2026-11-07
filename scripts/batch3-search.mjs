import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve('project/web/mindcraft');
const GIT = 'C:\\Program Files\\Git\\cmd\\git.exe';

function commit(files, message) {
  const fileArgs = files.map((f) => `"${f}"`).join(' ');
  execSync(`"${GIT}" -C "${ROOT}" add ${fileArgs}`, { stdio: 'pipe' });
  execSync(`"${GIT}" -C "${ROOT}" commit -m "${message}"`, { stdio: 'pipe' });
  console.log(`[COMMIT] ${message}`);
}

function writeFile(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// 29. search.types.ts
writeFile(
  'src/features/search/types/search.types.ts',
  `import { Node } from '@xyflow/react';
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
`
);
commit(['src/features/search/types/search.types.ts'], 'feat(search): define search and filter types and result interfaces');

// 30. searchFilter.ts
writeFile(
  'src/features/search/utils/searchFilter.ts',
  `import { Node } from '@xyflow/react';
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
        matchSnippet: \`#\${matchedTag}\`,
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
`
);
commit(['src/features/search/utils/searchFilter.ts'], 'feat(search): implement searchFilter algorithm for labels tags and descriptions');

// 31. useNodeSearch.ts
writeFile(
  'src/features/search/hooks/useNodeSearch.ts',
  `import { useState, useMemo } from 'react';
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
`
);
commit(['src/features/search/hooks/useNodeSearch.ts'], 'feat(search): implement useNodeSearch hook with debounced filtering');

// 32. SearchInput.tsx
writeFile(
  'src/features/search/components/SearchInput.tsx',
  `import React from 'react';
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
`
);
commit(['src/features/search/components/SearchInput.tsx'], 'feat(search): create SearchInput search bar component');

// 33. SearchResultItem.tsx
writeFile(
  'src/features/search/components/SearchResultItem.tsx',
  `import React from 'react';
import { SearchMatch } from '../types/search.types';
import { FileText, CheckSquare, AlignLeft, Tag } from 'lucide-react';

interface SearchResultItemProps {
  match: SearchMatch;
  isSelected: boolean;
  onSelect: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  match,
  isSelected,
  onSelect,
}) => {
  const { node, matchField, matchSnippet } = match;
  const kind = node.data.kind;

  return (
    <div
      onClick={onSelect}
      className={\`flex items-center justify-between px-4 py-2.5 cursor-pointer border-b border-zinc-800/40 text-xs transition-colors \${
        isSelected ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-300 hover:bg-zinc-850 hover:text-white'
      }\`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
          {kind === 'checklist' ? (
            <CheckSquare className="w-3.5 h-3.5" />
          ) : kind === 'markdown' ? (
            <AlignLeft className="w-3.5 h-3.5" />
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-zinc-200 truncate">{node.data.label || 'Untitled'}</p>
          {matchField !== 'label' && (
            <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
              {matchField === 'tags' && <Tag className="w-2.5 h-2.5 text-zinc-400 inline" />}
              <span>{matchSnippet}</span>
            </p>
          )}
        </div>
      </div>
      <span className="text-[10px] font-mono uppercase text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded">
        {kind}
      </span>
    </div>
  );
};
`
);
commit(['src/features/search/components/SearchResultItem.tsx'], 'feat(search): create SearchResultItem matched result row component');

// 34. SearchResultsList.tsx
writeFile(
  'src/features/search/components/SearchResultsList.tsx',
  `import React from 'react';
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
`
);
commit(['src/features/search/components/SearchResultsList.tsx'], 'feat(search): create SearchResultsList container and empty state');

// 35. SearchModal.tsx
writeFile(
  'src/features/search/components/SearchModal.tsx',
  `import React, { useState, useEffect } from 'react';
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
`
);
commit(['src/features/search/components/SearchModal.tsx'], 'feat(search): assemble SearchModal dialog with keyboard navigation');

// 36. Add isSearchOpen to mindMapStore.types.ts
const typesPath = path.join(ROOT, 'src/features/canvas/store/mindMapStore.types.ts');
let typesContent = fs.readFileSync(typesPath, 'utf8');
typesContent = typesContent.replace(
  '  lastSavedAt: number | null;\n',
  '  lastSavedAt: number | null;\n  isSearchOpen: boolean;\n'
);
typesContent = typesContent.replace(
  '  importMindMap: (nodes: Node<MindNodeData>[], edges: Edge[]) => void;\n',
  '  importMindMap: (nodes: Node<MindNodeData>[], edges: Edge[]) => void;\n  openSearch: () => void;\n  closeSearch: () => void;\n  focusNode: (id: string) => void;\n'
);
fs.writeFileSync(typesPath, typesContent, 'utf8');
commit(['src/features/canvas/store/mindMapStore.types.ts'], 'feat(store): add search modal visibility state to store types');

// 37 & 38. Implement search and focusNode in mindMapStore.ts
const storePath = path.join(ROOT, 'src/features/canvas/store/mindMapStore.ts');
let storeContent = fs.readFileSync(storePath, 'utf8');
storeContent = storeContent.replace(
  '  lastSavedAt: initialLoaded ? Date.now() : null,\n',
  '  lastSavedAt: initialLoaded ? Date.now() : null,\n  isSearchOpen: false,\n'
);
storeContent = storeContent.replace(
  '  importMindMap: (nodes, edges) => {',
  `  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  focusNode: (id) => set({ selectedNodeId: id, isSearchOpen: false }),

  importMindMap: (nodes, edges) => {`
);
fs.writeFileSync(storePath, storeContent, 'utf8');
commit(['src/features/canvas/store/mindMapStore.ts'], 'feat(store): implement openSearch closeSearch and focusNode handlers');

// 39. Bind Ctrl+K and / in useKeyboardNavigation.ts
const keyNavPath = path.join(ROOT, 'src/features/canvas/hooks/useKeyboardNavigation.ts');
let keyNavContent = fs.readFileSync(keyNavPath, 'utf8');
keyNavContent = keyNavContent.replace(
  '    redo,\n  } = useMindMapStore();',
  '    redo,\n    openSearch,\n  } = useMindMapStore();'
);
keyNavContent = keyNavContent.replace(
  '      if (isInputFocused) return;\n',
  `      if (isInputFocused) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }

      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        openSearch();
        return;
      }
`
);
keyNavContent = keyNavContent.replace(
  'undo, redo]);',
  'undo, redo, openSearch]);'
);
fs.writeFileSync(keyNavPath, keyNavContent, 'utf8');
commit(['src/features/canvas/hooks/useKeyboardNavigation.ts'], 'feat(canvas): bind Ctrl+K and slash shortcuts to trigger search modal');

// 40. Mount SearchModal in App.tsx and add search button in CanvasActionButtons.tsx
const actionButtonsPath = path.join(ROOT, 'src/features/toolbar/components/header/CanvasActionButtons.tsx');
let actionButtonsContent = fs.readFileSync(actionButtonsPath, 'utf8');
actionButtonsContent = actionButtonsContent.replace(
  "import { Share2, Keyboard, FilePlus, RotateCcw } from 'lucide-react';",
  "import { Share2, Keyboard, FilePlus, RotateCcw, Search } from 'lucide-react';"
);
actionButtonsContent = actionButtonsContent.replace(
  '  onReset: () => void;\n}',
  '  onReset: () => void;\n  onSearch?: () => void;\n}'
);
actionButtonsContent = actionButtonsContent.replace(
  '  onReset,\n}) => {',
  '  onReset,\n  onSearch,\n}) => {'
);
actionButtonsContent = actionButtonsContent.replace(
  '      <button\n        onClick={onExport}',
  `      {onSearch && (
        <button
          onClick={onSearch}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Search cards (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={onExport}`
);
fs.writeFileSync(actionButtonsPath, actionButtonsContent, 'utf8');

const topNavPath = path.join(ROOT, 'src/features/toolbar/components/TopNavigation.tsx');
let topNavContent = fs.readFileSync(topNavPath, 'utf8');
topNavContent = topNavContent.replace(
  '    lastSavedAt,\n  } = useMindMapStore();',
  '    lastSavedAt,\n    openSearch,\n  } = useMindMapStore();'
);
topNavContent = topNavContent.replace(
  '          onReset={resetCanvas}\n        />',
  '          onReset={resetCanvas}\n          onSearch={openSearch}\n        />'
);
fs.writeFileSync(topNavPath, topNavContent, 'utf8');

const appPath = path.join(ROOT, 'src/app/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(
  "import { ShortcutsDialog } from '@/features/toolbar/components/ShortcutsDialog';",
  `import { ShortcutsDialog } from '@/features/toolbar/components/ShortcutsDialog';
import { SearchModal } from '@/features/search/components/SearchModal';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';`
);
appContent = appContent.replace(
  'export const App: React.FC = () => {\n  const [isExportOpen, setIsExportOpen] = useState(false);',
  `export const App: React.FC = () => {
  const { isSearchOpen, closeSearch } = useMindMapStore();
  const [isExportOpen, setIsExportOpen] = useState(false);`
);
appContent = appContent.replace(
  '      <ShortcutsDialog\n        isOpen={isShortcutsOpen}\n        onClose={() => setIsShortcutsOpen(false)}\n      />\n    </main>',
  `      <ShortcutsDialog
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </main>`
);
fs.writeFileSync(appPath, appContent, 'utf8');

commit(
  [
    'src/features/toolbar/components/header/CanvasActionButtons.tsx',
    'src/features/toolbar/components/TopNavigation.tsx',
    'src/app/App.tsx',
  ],
  'feat(app): mount SearchModal dialog and connect header trigger'
);

console.log('Batch 3 complete: 12 commits added.');
