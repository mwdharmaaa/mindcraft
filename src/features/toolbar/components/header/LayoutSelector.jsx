const LayoutSelector = ({ current, onApply }) => {
  return <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
      <div className="flex items-center gap-0.5 px-1 py-0.5 bg-zinc-950/70 border border-zinc-800 rounded-lg">
        {["LR", "TB", "RADIAL"].map((dir) => <button
    key={dir}
    onClick={() => onApply(dir)}
    className={`px-2 py-0.5 text-[11px] rounded transition-all ${current === dir ? "bg-zinc-700 text-zinc-100 font-medium shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"}`}
    title={`Auto-layout: ${dir === "LR" ? "Horizontal Tree" : dir === "TB" ? "Vertical Tree" : "Radial"}`}
  >
            {dir === "LR" ? "Tree H" : dir === "TB" ? "Tree V" : "Radial"}
          </button>)}
      </div>
    </div>;
};
export {
  LayoutSelector
};
