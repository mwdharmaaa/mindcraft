import { useState, useEffect } from "react";
import { Position } from "@xyflow/react";
import { NodeHandle } from "./NodeHandle";
import { NodeEditToolbar } from "./NodeEditToolbar";
import { useMindMapStore } from "@/features/canvas/store/mindMapStore";
import { ChecklistHeader } from "./checklist/ChecklistHeader";
import { ChecklistProgressBar } from "./checklist/ChecklistProgressBar";
import { ChecklistItemRow } from "./checklist/ChecklistItemRow";
import { ChecklistInputForm } from "./checklist/ChecklistInputForm";
import { NodeTagsBadgeList } from "./parts/NodeTagsBadgeList";
const ChecklistNode = ({ id, data, selected }) => {
  const updateNodeData = useMindMapStore((s) => s.updateNodeData);
  const [newItemText, setNewItemText] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(data.label || "Checklist");
  useEffect(() => {
    setTitle(data.label || "Checklist");
  }, [data.label]);
  const checklist = data.checklist || [];
  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round(completedCount / checklist.length * 100) : 0;
  const toggleItem = (itemId) => {
    const nextList = checklist.map(
      (item) => item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateNodeData(id, { checklist: nextList });
  };
  const addItem = () => {
    if (!newItemText.trim()) return;
    const nextList = [
      ...checklist,
      { id: Date.now().toString(), text: newItemText.trim(), completed: false }
    ];
    updateNodeData(id, { checklist: nextList });
    setNewItemText("");
  };
  const removeItem = (itemId) => {
    const nextList = checklist.filter((item) => item.id !== itemId);
    updateNodeData(id, { checklist: nextList });
  };
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    updateNodeData(id, { label: title.trim() || "Checklist" });
  };
  return <div
    className={`relative group w-64 bg-zinc-900 border rounded-xl p-3 shadow-lg transition-all ${selected ? "border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/70" : "border-zinc-700 hover:border-zinc-500"}`}
    style={{ borderLeftColor: data.color || "#d4d4d8", borderLeftWidth: "3px" }}
  >
      <NodeEditToolbar
    nodeId={id}
    isVisible={!!selected}
    currentKind="checklist"
    currentShape={data.shape}
  />

      <NodeHandle type="target" position={Position.Left} id="target-l" />
      <NodeHandle type="source" position={Position.Left} id="source-l" />
      <NodeHandle type="target" position={Position.Right} id="target-r" />
      <NodeHandle type="source" position={Position.Right} id="source-r" />
      <NodeHandle type="target" position={Position.Top} id="target-t" />
      <NodeHandle type="source" position={Position.Top} id="source-t" />
      <NodeHandle type="target" position={Position.Bottom} id="target-b" />
      <NodeHandle type="source" position={Position.Bottom} id="source-b" />

      <ChecklistHeader
    label={title}
    isEditing={isEditingTitle}
    completedCount={completedCount}
    totalCount={checklist.length}
    onTitleChange={setTitle}
    onTitleBlur={handleTitleBlur}
    onClick={(e) => {
      e.stopPropagation();
      setIsEditingTitle(true);
    }}
    onDoubleClick={(e) => {
      e.stopPropagation();
      setIsEditingTitle(true);
    }}
  />

      <ChecklistProgressBar percent={progressPercent} />

      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {checklist.length === 0 ? <div className="text-[11px] text-zinc-500 italic py-1 text-center">
            No tasks yet. Add a task below.
          </div> : checklist.map((item) => <ChecklistItemRow
    key={item.id}
    item={item}
    onToggle={toggleItem}
    onRemove={removeItem}
  />)}
      </div>

      <div className="mt-2">
        <NodeTagsBadgeList tags={data.tags} />
      </div>

      <ChecklistInputForm
    value={newItemText}
    onChange={setNewItemText}
    onSubmit={addItem}
  />
    </div>;
};
export {
  ChecklistNode
};
