import React from 'react';
import { Share2, Keyboard, FilePlus, RotateCcw, Search, FolderKanban } from 'lucide-react';

interface CanvasActionButtonsProps {
  onExport: () => void;
  onShortcuts: () => void;
  onBlank: () => void;
  onReset: () => void;
  onSearch?: () => void;
  onProjects?: () => void;
}

export const CanvasActionButtons: React.FC<CanvasActionButtonsProps> = ({
  onExport,
  onShortcuts,
  onBlank,
  onReset,
  onSearch,
  onProjects,
}) => {
  return (
    <>
      {onSearch && (
        <button
          onClick={onSearch}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Search cards (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>
      )}

      {onProjects && (
        <button
          onClick={onProjects}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Manage workspaces"
        >
          <FolderKanban className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg text-zinc-100 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 font-medium transition-all shadow-sm"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Export</span>
      </button>

      <button
        onClick={onShortcuts}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        title="Keyboard shortcuts"
      >
        <Keyboard className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-0.5 pl-1 border-l border-zinc-800">
        <button
          onClick={onBlank}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="New blank map"
        >
          <FilePlus className="w-4 h-4" />
        </button>
        <button
          onClick={onReset}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Reset to story template"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};
