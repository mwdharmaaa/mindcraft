const CardTypeSelector = ({
  currentKind,
  onSelectKind
}) => {
  return <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-zinc-400">Card Type</label>
      <div className="grid grid-cols-3 gap-1 bg-zinc-800/80 p-1 rounded-lg border border-zinc-700">
        {["topic", "checklist", "markdown"].map((kind) => <button
    key={kind}
    onClick={() => onSelectKind(kind)}
    className={`text-xs py-1 rounded capitalize font-medium transition-all ${currentKind === kind ? "bg-zinc-700 text-zinc-100 shadow" : "text-zinc-400 hover:text-zinc-200"}`}
  >
            {kind === "topic" ? "Card" : kind === "markdown" ? "Note" : "Checklist"}
          </button>)}
      </div>
    </div>;
};
export {
  CardTypeSelector
};
