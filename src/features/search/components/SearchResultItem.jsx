import { FileText, CheckSquare, AlignLeft, Tag } from "lucide-react";
const SearchResultItem = ({
  match,
  isSelected,
  onSelect
}) => {
  const { node, matchField, matchSnippet } = match;
  const kind = node.data.kind;
  return <div
    onClick={onSelect}
    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer border-b border-zinc-800/40 text-xs transition-colors ${isSelected ? "bg-zinc-800 text-zinc-100" : "text-zinc-300 hover:bg-zinc-850 hover:text-white"}`}
  >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
          {kind === "checklist" ? <CheckSquare className="w-3.5 h-3.5" /> : kind === "markdown" ? <AlignLeft className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-zinc-200 truncate">{node.data.label || "Untitled"}</p>
          {matchField !== "label" && <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
              {matchField === "tags" && <Tag className="w-2.5 h-2.5 text-zinc-400 inline" />}
              <span>{matchSnippet}</span>
            </p>}
        </div>
      </div>
      <span className="text-[10px] font-mono uppercase text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded">
        {kind}
      </span>
    </div>;
};
export {
  SearchResultItem
};
