import React from 'react';

interface ResetZoomButtonProps {
  zoomPercent: number;
  onClick: () => void;
}

export const ResetZoomButton: React.FC<ResetZoomButtonProps> = ({ zoomPercent, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 text-[11px] font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
      title="Reset zoom to 100% (Ctrl+0)"
    >
      {zoomPercent}%
    </button>
  );
};
