import React from 'react';
import { Maximize2 } from 'lucide-react';

interface ZoomFitButtonProps {
  onClick: () => void;
}

export const ZoomFitButton: React.FC<ZoomFitButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      title="Fit view (Ctrl+9)"
    >
      <Maximize2 className="w-3.5 h-3.5" />
    </button>
  );
};
