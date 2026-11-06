import React, { useEffect, useRef } from 'react';
import { PlusSquare, CheckSquare, FileText, X } from 'lucide-react';

interface FloatingCardMenuProps {
  isOpen: boolean;
  screenPos: { x: number; y: number } | null;
  onClose: () => void;
  onSelectType: (kind: 'topic' | 'checklist' | 'markdown') => void;
}

export const FloatingCardMenu: React.FC<FloatingCardMenuProps> = ({
  isOpen,
  screenPos,
  onClose,
  onSelectType,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '1') onSelectType('topic');
      if (e.key === '2') onSelectType('checklist');
      if (e.key === '3') onSelectType('markdown');
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, onSelectType]);

  if (!isOpen || !screenPos) return null;

  // Viewport bounds check so the popup stays inside the screen
  const menuWidth = 190;
  const menuHeight = 150;
  const posX = Math.min(screenPos.x, window.innerWidth - menuWidth - 16);
  const posY = Math.min(screenPos.y, window.innerHeight - menuHeight - 16);

  return (
    <div
      ref={menuRef}
      style={{ left: posX, top: posY }}
      className="fixed z-50 w-48 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100 select-none"
    >
      <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-zinc-800/60 text-[11px] font-semibold text-zinc-400">
        <span>Add Card</span>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-0.5">
        <button
          onClick={() => onSelectType('topic')}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-200 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent transition-all group"
        >
          <div className="flex items-center gap-2">
            <PlusSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>Story Card</span>
          </div>
          <kbd className="text-[10px] font-mono text-zinc-500 group-hover:text-blue-300">1</kbd>
        </button>

        <button
          onClick={() => onSelectType('checklist')}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-200 hover:text-white hover:bg-emerald-600/20 hover:border-emerald-500/30 border border-transparent transition-all group"
        >
          <div className="flex items-center gap-2">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Checklist Card</span>
          </div>
          <kbd className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-300">2</kbd>
        </button>

        <button
          onClick={() => onSelectType('markdown')}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-200 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/30 border border-transparent transition-all group"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Scene Notes</span>
          </div>
          <kbd className="text-[10px] font-mono text-zinc-500 group-hover:text-purple-300">3</kbd>
        </button>
      </div>
    </div>
  );
};
