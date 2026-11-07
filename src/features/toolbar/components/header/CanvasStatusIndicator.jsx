const CanvasStatusIndicator = ({ lastSavedAt }) => {
  if (!lastSavedAt) return null;
  return <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono pl-3 border-l border-zinc-800">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
      <span>Saved</span>
    </div>;
};
export {
  CanvasStatusIndicator
};
