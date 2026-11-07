import { Plus } from "lucide-react";
const NodeAddChildButton = ({ onClick }) => {
  return <button
    onClick={onClick}
    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 w-4 h-4 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
    title="Add child card"
  >
      <Plus className="w-3 h-3 text-zinc-300" />
    </button>;
};
export {
  NodeAddChildButton
};
