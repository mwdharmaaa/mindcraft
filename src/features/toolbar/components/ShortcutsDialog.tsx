import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Tab', desc: 'Add child topic to selected node' },
  { key: 'Enter', desc: 'Add sibling topic' },
  { key: 'Del / Backspace', desc: 'Delete node and its descendants' },
  { key: 'Ctrl + Z', desc: 'Undo last action' },
  { key: 'Ctrl + Y / Shift+Z', desc: 'Redo last action' },
  { key: 'Double Click', desc: 'Edit title inline' },
  { key: 'Space + Drag', desc: 'Pan infinite canvas' },
  { key: 'Scroll Wheel', desc: 'Zoom in / out' },
];

export const ShortcutsDialog: React.FC<ShortcutsDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          {SHORTCUTS.map((item) => (
            <div key={item.key} className="flex items-center justify-between py-1 border-b border-zinc-800/40 text-xs">
              <span className="text-zinc-400">{item.desc}</span>
              <kbd className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 font-mono text-[11px] shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
