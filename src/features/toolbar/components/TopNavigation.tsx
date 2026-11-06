import React from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import {
  LayoutDirection,
  ConnectorType,
  CanvasScrollMode,
} from '@/features/canvas/store/mindMapStore.types';
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
    applyLayout,
    layoutDirection,
    connectorType,
    setConnectorType,
    scrollMode,
    setScrollMode,
  } = useMindMapStore();

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl px-4 py-2 pointer-events-auto shadow-xl">
        <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Network className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-sm tracking-tight text-zinc-100">MindCraft</span>
          <span className="text-[10px] font-mono uppercase text-zinc-500">v0.1</span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl p-1 pointer-events-auto shadow-xl">
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
          {(['LR', 'TB', 'RADIAL'] as LayoutDirection[]).map((dir) => (
            <button
              key={dir}
              onClick={() => applyLayout(dir)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                layoutDirection === dir
                  ? 'bg-zinc-800 text-blue-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {dir === 'LR' ? 'Horizontal' : dir === 'TB' ? 'Top-Down' : 'Radial'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
          {(['horizontal', 'vertical', 'free'] as CanvasScrollMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setScrollMode(mode)}
              className={`px-2 py-1 text-xs rounded-lg transition-all ${
                scrollMode === mode
                  ? 'bg-zinc-800 text-sky-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title={`Pan axis on wheel scroll: ${mode}`}
            >
              {mode === 'horizontal' ? 'Scroll X' : mode === 'vertical' ? 'Scroll Y' : 'Scroll Free'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
          {(['smoothstep', 'bezier', 'straight'] as ConnectorType[]).map((conn) => (
            <button
              key={conn}
              onClick={() => setConnectorType(conn)}
              className={`px-2.5 py-1 text-xs rounded-lg capitalize transition-all ${
                connectorType === conn
                  ? 'bg-zinc-800 text-emerald-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {conn === 'smoothstep' ? 'Step' : conn}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg text-zinc-200 hover:text-white bg-blue-600 hover:bg-blue-500 font-medium transition-colors shadow-sm"
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
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
          title="Reset canvas template"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
