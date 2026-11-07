import { X, Command } from "lucide-react";
const SHORTCUTS = [
  { key: "Double Click Canvas", desc: "Create new empty card" },
  { key: "Click Card", desc: "Open contextual edit navigation" },
  { key: "Double Click Card", desc: "Edit title inline" },
  { key: "Arrow Keys", desc: "Navigate focus (child / parent / siblings)" },
  { key: "Tab", desc: "Add connected child card" },
  { key: "Enter", desc: "Add sibling card" },
  { key: "Del / Backspace", desc: "Delete card and descendants" },
  { key: "Ctrl + D", desc: "Duplicate card & descendants" },
  { key: "Ctrl + C / V", desc: "Copy and paste branch" },
  { key: "Ctrl + K or /", desc: "Quick search cards" },
  { key: "Ctrl + 0", desc: "Reset zoom to 100%" },
  { key: "Ctrl + 9", desc: "Fit canvas to view" },
  { key: "Ctrl + Shift + T", desc: "Open theme selector" },
  { key: "Scroll Wheel", desc: "Slide canvas up / down" },
  { key: "Shift + Scroll", desc: "Slide canvas left / right" },
  { key: "2-Finger Pinch", desc: "Zoom canvas in / out" },
  { key: "Space + Drag", desc: "Freeform pan canvas" },
  { key: "Ctrl + Z", desc: "Undo last action" },
  { key: "Ctrl + Y", desc: "Redo last action" }
];
const ShortcutsDialog = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-zinc-200" />
            <h3 className="text-sm font-semibold text-zinc-100">Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          {SHORTCUTS.map((item) => <div key={item.key} className="flex items-center justify-between py-1 border-b border-zinc-800/40 text-xs">
              <span className="text-zinc-400">{item.desc}</span>
              <kbd className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 font-mono text-[11px] shadow-sm">
                {item.key}
              </kbd>
            </div>)}
        </div>
      </div>
    </div>;
};
export {
  ShortcutsDialog
};
