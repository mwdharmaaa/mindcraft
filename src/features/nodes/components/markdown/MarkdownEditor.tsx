import React from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write documentation or note here..."
      rows={4}
      autoFocus
      className="w-full bg-zinc-800/90 text-zinc-200 text-xs p-2 rounded outline-none border border-zinc-500 font-mono resize-none placeholder:text-zinc-500"
    />
  );
};
