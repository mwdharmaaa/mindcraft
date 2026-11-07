import React from 'react';

interface MarkdownViewerProps {
  markdown?: string;
  onDoubleClick: (e: React.MouseEvent) => void;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  markdown,
  onDoubleClick,
}) => {
  return (
    <div
      onDoubleClick={onDoubleClick}
      className={`text-xs leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto cursor-text select-text ${
        markdown ? 'text-zinc-300 font-sans' : 'text-zinc-500 italic'
      }`}
    >
      {markdown || 'Empty note. Double-click to write documentation...'}
    </div>
  );
};
