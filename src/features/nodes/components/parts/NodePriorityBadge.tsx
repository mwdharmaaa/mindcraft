import React from 'react';
import { NodePriority } from '@/features/nodes/types/node.types';

interface NodePriorityBadgeProps {
  priority?: NodePriority;
}

export const NodePriorityBadge: React.FC<NodePriorityBadgeProps> = ({ priority }) => {
  if (!priority || priority === 'none') return null;

  const styleClass =
    priority === 'urgent'
      ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-200'
      : priority === 'high'
      ? 'bg-zinc-700 text-zinc-100 border border-zinc-600'
      : 'bg-zinc-800 text-zinc-400 border border-zinc-700';

  return (
    <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${styleClass}`}>
      {priority}
    </span>
  );
};
