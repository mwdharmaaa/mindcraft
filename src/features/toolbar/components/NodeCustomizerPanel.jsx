import { useMindMapStore } from "@/features/canvas/store/mindMapStore";
import { Trash2, Plus, GitBranch, Layers, Copy } from "lucide-react";
import { ColorPalettePicker } from "./inspector/ColorPalettePicker";
import { CardTypeSelector } from "./inspector/CardTypeSelector";
import { CardShapeSelector } from "./inspector/CardShapeSelector";
import { PrioritySelector } from "./inspector/PrioritySelector";
import { TagManager } from "./inspector/TagManager";
const NodeCustomizerPanel = () => {
  const {
    nodes,
    selectedNodeId,
    updateNodeData,
    addChildNode,
    addSiblingNode,
    duplicateSubtree,
    deleteSubtree
  } = useMindMapStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (!selectedNode) return null;
  const data = selectedNode.data;
  const isRoot = data.kind === "root";
  const handleAddTag = (newTag) => {
    const currentTags = data.tags || [];
    if (!currentTags.includes(newTag)) {
      updateNodeData(selectedNode.id, { tags: [...currentTags, newTag] });
    }
  };
  const handleRemoveTag = (targetTag) => {
    const currentTags = data.tags || [];
    updateNodeData(selectedNode.id, {
      tags: currentTags.filter((t) => t !== targetTag)
    });
  };
  return <aside className="absolute bottom-6 left-6 z-20 w-80 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-2xl p-4 shadow-2xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-200" />
          <span className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
            {isRoot ? "Root Card" : "Card Inspector"}
          </span>
        </div>
        {!isRoot && <div className="flex items-center gap-1">
            <button
    onClick={() => duplicateSubtree(selectedNode.id)}
    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
    title="Duplicate card & branch (Ctrl+D)"
  >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
    onClick={() => deleteSubtree(selectedNode.id)}
    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
    title="Delete card & branch"
  >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          </div>}
      </div>

      <ColorPalettePicker
    currentColor={data.color}
    onSelectColor={(color) => updateNodeData(selectedNode.id, { color })}
  />

      {!isRoot && <>
          <CardTypeSelector
    currentKind={data.kind}
    onSelectKind={(kind) => updateNodeData(selectedNode.id, { kind })}
  />

          <CardShapeSelector
    currentShape={data.shape}
    onSelectShape={(shape) => updateNodeData(selectedNode.id, { shape })}
  />

          <PrioritySelector
    currentPriority={data.priority}
    onSelectPriority={(priority) => updateNodeData(selectedNode.id, { priority })}
  />

          <TagManager
    tags={data.tags}
    onAddTag={handleAddTag}
    onRemoveTag={handleRemoveTag}
  />
        </>}

      <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
        <button
    onClick={() => addChildNode(selectedNode.id)}
    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all"
  >
          <Plus className="w-3.5 h-3.5 text-zinc-300" />
          <span>Add Child Card</span>
        </button>
        {!isRoot && <button
    onClick={() => addSiblingNode(selectedNode.id)}
    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all"
  >
            <GitBranch className="w-3.5 h-3.5 text-zinc-300" />
            <span>Add Sibling Card</span>
          </button>}
      </div>
    </aside>;
};
export {
  NodeCustomizerPanel
};
