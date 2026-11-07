import React from 'react';
import { Plus } from 'lucide-react';

interface ChecklistInputFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export const ChecklistInputForm: React.FC<ChecklistInputFormProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center gap-1.5">
      <input
        type="text"
        placeholder="New task..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        className="bg-zinc-800/80 text-zinc-200 text-xs px-2 py-1 rounded outline-none border border-transparent focus:border-zinc-400 flex-1 placeholder:text-zinc-500"
      />
      <button
        onClick={onSubmit}
        className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors"
        title="Add task"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
