import { ChevronRight } from "lucide-react";
const NodeCollapseButton = ({
  hasChildren,
  collapsed,
  onToggle
}) => {
  if (!hasChildren) return null;
  return <button
    onClick={onToggle}
    className="w-4 h-4 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
    title={collapsed ? "Expand branch" : "Collapse branch"}
  >
      <ChevronRight
    className={`w-3.5 h-3.5 transition-transform duration-150 ${collapsed ? "rotate-0 text-zinc-300" : "rotate-90"}`}
  />
    </button>;
};
export {
  NodeCollapseButton
};
