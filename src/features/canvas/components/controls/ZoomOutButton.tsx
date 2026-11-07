import React from 'react';
import { Minus } from 'lucide-react';

interface ZoomOutButtonProps {
  onClick: () => void;
}

export const ZoomOutButton: React.FC<ZoomOutButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      title="Zoom out (-)"
    >
      <Minus className="w-3.5 h-3.5" />
    </button>
  );
};
