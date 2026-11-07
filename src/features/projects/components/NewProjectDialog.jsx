import { useState } from "react";
import { Plus, X } from "lucide-react";
const NewProjectDialog = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState("");
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
    setName("");
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-100">Create New Mind Map</h3>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="e.g. System Architecture, Story Outline..."
    autoFocus
    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-zinc-400 placeholder:text-zinc-500"
  />
          <div className="flex items-center justify-end gap-2">
            <button
    type="button"
    onClick={onClose}
    className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
  >
              Cancel
            </button>
            <button
    type="submit"
    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-200 hover:bg-white text-zinc-950 rounded-lg text-xs font-semibold transition-colors"
  >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export {
  NewProjectDialog
};
