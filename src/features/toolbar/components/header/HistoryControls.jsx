import { Undo2, Redo2 } from "lucide-react";
const HistoryControls = ({ onUndo, onRedo }) => {
  return <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
      <button
    onClick={onUndo}
    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
    title="Undo (Ctrl+Z)"
  >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
    onClick={onRedo}
    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
    title="Redo (Ctrl+Y)"
  >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>;
};
export {
  HistoryControls
};
