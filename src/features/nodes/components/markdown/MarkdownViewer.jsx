const MarkdownViewer = ({
  markdown,
  onClick,
  onDoubleClick
}) => {
  return <div
    onClick={onClick || onDoubleClick}
    onDoubleClick={onDoubleClick}
    title="Click to write documentation..."
    className={`text-xs leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto cursor-text select-text ${markdown ? "text-zinc-300 font-sans" : "text-zinc-500 italic"}`}
  >
      {markdown || "Empty note. Click to write documentation..."}
    </div>;
};
export {
  MarkdownViewer
};
