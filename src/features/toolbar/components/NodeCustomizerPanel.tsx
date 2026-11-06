import React from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import {
  NodeShape,
  NodeTypeKind,
  NodePriority,
} from '@/features/nodes/types/node.types';
import { Trash2, Plus, GitBranch, Layers } from 'lucide-react';

const COLOR_PALETTE = [
  '#ffffff', // crisp white
  '#f4f4f5', // zinc 100
  '#e4e4e7', // zinc 200
  '#d4d4d8', // zinc 300
  '#a1a1aa', // zinc 400
  '#71717a', // zinc 500
  '#52525b', // zinc 600
  '#3f3f46', // zinc 700
  '#27272a', // zinc 800
];

export const NodeCustomizerPanel: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    updateNodeData,
    addChildNode,
    addSiblingNode,
    deleteSubtree,
  } = useMindMapStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (!selectedNode) return null;

  const data = selectedNode.data;
  const isRoot = data.kind === 'root';

  return (
    <aside className="absolute bottom-6 left-6 z-20 w-80 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-2xl p-4 shadow-2xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-200" />
          <span className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
            {isRoot ? 'Root Card' : 'Card Inspector'}
          </span>
        </div>
        {!isRoot && (
          <button
            onClick={() => deleteSubtree(selectedNode.id)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Delete card & branch"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-zinc-400">Accent Border</label>
        <div className="flex items-center gap-2 flex-wrap">
          {COLOR_PALETTE.map((hex) => (
            <button
              key={hex}
              onClick={() => updateNodeData(selectedNode.id, { color: hex })}
              className={`w-5 h-5 rounded-full border transition-transform ${
                data.color === hex
                  ? 'scale-125 border-white shadow-sm ring-2 ring-zinc-500/40'
                  : 'border-zinc-700 hover:scale-110'
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      {!isRoot && (
        <>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">Card Type</label>
            <div className="grid grid-cols-3 gap-1 bg-zinc-800/80 p-1 rounded-lg border border-zinc-700">
              {(['topic', 'checklist', 'markdown'] as NodeTypeKind[]).map((kind) => (
                <button
                  key={kind}
                  onClick={() => updateNodeData(selectedNode.id, { kind })}
                  className={`text-xs py-1 rounded capitalize font-medium transition-all ${
                    data.kind === kind
                      ? 'bg-zinc-700 text-zinc-100 shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {kind === 'topic' ? 'Card' : kind === 'markdown' ? 'Note' : 'Checklist'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">Shape</label>
            <div className="grid grid-cols-3 gap-1 bg-zinc-800/80 p-1 rounded-lg border border-zinc-700">
              {(['rounded', 'pill', 'rectangle'] as NodeShape[]).map((shape) => (
                <button
                  key={shape}
                  onClick={() => updateNodeData(selectedNode.id, { shape })}
                  className={`text-xs py-1 rounded capitalize font-medium transition-all ${
                    (data.shape || 'rounded') === shape
                      ? 'bg-zinc-700 text-zinc-100 shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">Priority</label>
            <div className="flex items-center gap-1">
              {(['none', 'low', 'medium', 'high', 'urgent'] as NodePriority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => updateNodeData(selectedNode.id, { priority: p })}
                  className={`px-2 py-0.5 text-[10px] uppercase font-mono rounded transition-colors ${
                    (data.priority || 'none') === p
                      ? 'bg-zinc-200 text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
        <button
          onClick={() => addChildNode(selectedNode.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-300" />
          <span>Add Child Card</span>
        </button>
        {!isRoot && (
          <button
            onClick={() => addSiblingNode(selectedNode.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all"
          >
            <GitBranch className="w-3.5 h-3.5 text-zinc-300" />
            <span>Add Sibling Card</span>
          </button>
        )}
      </div>
    </aside>
  );
};
