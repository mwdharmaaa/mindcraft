import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TagManagerProps {
  tags?: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags = [],
  onAddTag,
  onRemoveTag,
}) => {
  const [tagInput, setTagInput] = useState('');

  const submitTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (!clean) return;
    onAddTag(clean);
    setTagInput('');
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
          <Tag className="w-3 h-3 text-zinc-400" />
          <span>Tags</span>
        </label>
      </div>
      {tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700"
            >
              <span>#{tag}</span>
              <button
                onClick={() => onRemoveTag(tag)}
                className="text-zinc-500 hover:text-zinc-200"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), submitTag())}
          placeholder="Add tag..."
          className="flex-1 bg-zinc-800 text-zinc-100 text-xs px-2 py-1 rounded border border-zinc-700 outline-none focus:border-zinc-400 placeholder:text-zinc-500"
        />
        <button
          onClick={submitTag}
          className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700"
          title="Add tag"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
