import React from 'react';
import { ChecklistItem } from '@/features/nodes/types/node.types';
import { Trash2 } from 'lucide-react';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({
  item,
  onToggle,
  onRemove,
}) => {
  return (
    <div className="group/item flex items-center justify-between text-xs py-0.5">
      <label className="flex items-center gap-2 cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item.id)}
          className="rounded border-zinc-700 bg-zinc-800 text-zinc-200 focus:ring-0 w-3.5 h-3.5 accent-zinc-200 cursor-pointer"
        />
        <span
          className={`select-text ${
            item.completed ? 'line-through text-zinc-500' : 'text-zinc-300'
          }`}
        >
          {item.text}
        </span>
      </label>
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover/item:opacity-100 text-zinc-500 hover:text-zinc-100 transition-opacity p-0.5"
        title="Remove task"
      >
        <Trash2 className="w-3 h-3 text-zinc-400" />
      </button>
    </div>
  );
};
