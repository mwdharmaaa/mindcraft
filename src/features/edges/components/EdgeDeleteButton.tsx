import React from 'react';
import { X } from 'lucide-react';

interface EdgeDeleteButtonProps {
  x: number;
  y: number;
  onClick: (e: React.MouseEvent) => void;
}

export const EdgeDeleteButton: React.FC<EdgeDeleteButtonProps> = ({ x, y, onClick }) => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        pointerEvents: 'all',
      }}
      className="nodrag nopan"
    >
      <button
        onClick={onClick}
        className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700 hover:border-rose-500 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-200 flex items-center justify-center transition-all shadow-md"
        title="Disconnect card"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
};
