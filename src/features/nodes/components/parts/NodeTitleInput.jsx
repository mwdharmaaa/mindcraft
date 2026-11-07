const NodeTitleInput = ({
  isEditing,
  label,
  placeholder = "Empty card - double click to type",
  onChange,
  onBlur,
  onDoubleClick
}) => {
  if (isEditing) {
    return <input
      type="text"
      value={label}
      placeholder="Type note title..."
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => e.key === "Enter" && onBlur()}
      autoFocus
      className="bg-zinc-800 text-zinc-100 text-xs px-1.5 py-0.5 rounded outline-none border border-zinc-400 min-w-[120px] placeholder:text-zinc-500"
    />;
  }
  return <span
    onDoubleClick={onDoubleClick}
    className={`text-xs select-text cursor-text ${label ? "font-medium text-zinc-200" : "italic text-zinc-500"}`}
  >
      {label || placeholder}
    </span>;
};
export {
  NodeTitleInput
};
