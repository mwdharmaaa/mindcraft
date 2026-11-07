import React from 'react';
import { NodePriority } from '@/features/nodes/types/node.types';

interface PrioritySelectorProps {
  currentPriority?: NodePriority;
  onSelectPriority: (priority: NodePriority) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  currentPriority = 'none',
  onSelectPriority,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-zinc-400">Priority</label>
      <div className="flex items-center gap-1">
        {(['none', 'low', 'medium', 'high', 'urgent'] as NodePriority[]).map((p) => (
          <button
            key={p}
            onClick={() => onSelectPriority(p)}
            className={`px-2 py-0.5 text-[10px] uppercase font-mono rounded transition-colors ${
              currentPriority === p
                ? 'bg-zinc-200 text-zinc-950 font-bold shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};
