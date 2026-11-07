import React from 'react';
import { Plus } from 'lucide-react';

interface ZoomInButtonProps {
  onClick: () => void;
}

export const ZoomInButton: React.FC<ZoomInButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      title="Zoom in (+)"
    >
      <Plus className="w-3.5 h-3.5" />
    </button>
  );
};
