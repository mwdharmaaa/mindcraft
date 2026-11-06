import React from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { ConnectorType } from '@/features/canvas/store/mindMapStore.types';
import {
  Undo2,
  Redo2,
  Share2,
  Keyboard,
  RotateCcw,
  Network,
} from 'lucide-react';

interface TopNavigationProps {
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onOpenExport,
  onOpenShortcuts,
}) => {
  const {
    undo,
    redo,
    resetCanvas,
    connectorType,
    setConnectorType,
  } = useMindMapStore();

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-3 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl px-4 py-2 pointer-events-auto shadow-xl">
        <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
          <Network className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-sm tracking-tight text-zinc-100">MindCraft</span>
          <span className="text-[10px] font-mono uppercase text-zinc-400">Story Studio</span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl p-1 pointer-events-auto shadow-xl">
        <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
          <button
            onClick={undo}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
          {(['smoothstep', 'bezier', 'straight'] as ConnectorType[]).map((conn) => (
            <button
              key={conn}
              onClick={() => setConnectorType(conn)}
              className={`px-2.5 py-1 text-xs rounded-lg capitalize transition-all ${
                connectorType === conn
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-600 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {conn === 'smoothstep' ? 'Step' : conn}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg text-zinc-100 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 font-medium transition-all shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title="Keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          onClick={resetCanvas}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Reset canvas template"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
