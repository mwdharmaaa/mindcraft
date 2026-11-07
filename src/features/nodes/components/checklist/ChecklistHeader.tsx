import React from 'react';
import { CheckSquare } from 'lucide-react';

interface ChecklistHeaderProps {
  label: string;
  isEditing: boolean;
  completedCount: number;
  totalCount: number;
  onTitleChange: (val: string) => void;
  onTitleBlur: () => void;
  onDoubleClick: (e: React.MouseEvent) => void;
}

export const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({
  label,
  isEditing,
  completedCount,
  totalCount,
  onTitleChange,
  onTitleBlur,
  onDoubleClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 flex-1 mr-2">
        <CheckSquare className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && onTitleBlur()}
            autoFocus
            className="bg-zinc-800 text-zinc-100 text-xs px-1 py-0.5 rounded outline-none border border-zinc-400 w-full"
          />
        ) : (
          <span
            onDoubleClick={onDoubleClick}
            className="truncate cursor-text"
            title="Double click to edit title"
          >
            {label || 'Checklist'}
          </span>
        )}
      </div>
      <span className="text-[10px] font-mono text-zinc-400 shrink-0">
        {completedCount}/{totalCount}
      </span>
    </div>
  );
};
