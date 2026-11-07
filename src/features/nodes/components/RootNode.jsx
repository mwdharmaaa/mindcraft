import { useState } from "react";
import { Position } from "@xyflow/react";
import { NodeHandle } from "./NodeHandle";
import { useMindMapStore } from "@/features/canvas/store/mindMapStore";
import { Network } from "lucide-react";
const RootNode = ({ id, data, selected }) => {
  const updateNodeData = useMindMapStore((s) => s.updateNodeData);
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const handleBlur = () => {
    setIsEditing(false);
    updateNodeData(id, { label: label.trim() || "Central Idea" });
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBlur();
  };
  return <div
    className={`relative group px-5 py-3.5 rounded-xl bg-zinc-900 border transition-all duration-200 shadow-xl ${selected ? "border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/80" : "border-zinc-700 hover:border-zinc-500"}`}
    style={{
      borderLeftColor: data.color || "#f4f4f5",
      borderLeftWidth: "4px"
    }}
  >
      <NodeHandle type="target" position={Position.Left} id="target-l" />
      <NodeHandle type="source" position={Position.Left} id="source-l" />
      <NodeHandle type="target" position={Position.Right} id="target-r" />
      <NodeHandle type="source" position={Position.Right} id="source-r" />
      <NodeHandle type="target" position={Position.Top} id="target-t" />
      <NodeHandle type="source" position={Position.Top} id="source-t" />
      <NodeHandle type="target" position={Position.Bottom} id="target-b" />
      <NodeHandle type="source" position={Position.Bottom} id="source-b" />

      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
          <Network className="w-4 h-4" />
        </div>

        {isEditing ? <input
    type="text"
    value={label}
    onChange={(e) => setLabel(e.target.value)}
    onBlur={handleBlur}
    onKeyDown={handleKeyDown}
    autoFocus
    className="bg-zinc-800 text-zinc-100 font-semibold px-2 py-0.5 rounded outline-none border border-zinc-400 text-sm w-44"
  /> : <span
    onDoubleClick={(e) => {
      e.stopPropagation();
      setIsEditing(true);
    }}
    className="text-zinc-100 font-semibold text-sm tracking-tight cursor-text select-text"
  >
            {data.label}
          </span>}
      </div>
    </div>;
};
export {
  RootNode
};
