import React from 'react';
import { ThemePreset } from '../types/theme.types';
import { Check } from 'lucide-react';

interface ThemePreviewCardProps {
  preset: ThemePreset;
  isActive: boolean;
  onSelect: () => void;
}

export const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({
  preset,
  isActive,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border p-3.5 transition-all flex items-center justify-between ${
        isActive
          ? 'bg-zinc-800 border-zinc-200 shadow-md ring-2 ring-zinc-500/20'
          : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg border border-zinc-700 shadow-inner flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: preset.canvasBg }}
        >
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: preset.primaryAccent }}
          />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-zinc-100">{preset.name}</h4>
          <p className="text-[11px] font-mono text-zinc-400 capitalize">
            {preset.variant} &bull; {preset.dotGap}px
          </p>
        </div>
      </div>
      {isActive && (
        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-950 flex items-center justify-center">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      )}
    </div>
  );
};
