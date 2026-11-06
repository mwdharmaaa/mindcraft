import React from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import {
  NodeShape,
  NodeTypeKind,
  NodePriority,
} from '@/features/nodes/types/node.types';
import { Trash2, Plus, GitBranch, Layers } from 'lucide-react';

const COLOR_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // slate
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
    <aside className="absolute bottom-6 left-6 z-20 w-80 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
            {isRoot ? 'Root Node' : 'Node Inspector'}
          </span>
        </div>
        {!isRoot && (
          <button
            onClick={() => deleteSubtree(selectedNode.id)}
            className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
            title="Delete node & subtree"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-zinc-400">Accent Color</label>
        <div className="flex items-center gap-2">
          {COLOR_PALETTE.map((hex) => (
            <button
              key={hex}
              onClick={() => updateNodeData(selectedNode.id, { color: hex })}
              className={`w-6 h-6 rounded-full transition-transform ${
                data.color === hex ? 'scale-125 ring-2 ring-white/60' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      {!isRoot && (
        <>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">Node Type</label>
            <div className="grid grid-cols-3 gap-1 bg-zinc-800/60 p-1 rounded-lg">
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
                  {kind}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">Shape</label>
            <div className="grid grid-cols-3 gap-1 bg-zinc-800/60 p-1 rounded-lg">
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
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
        <button
          onClick={() => addChildNode(selectedNode.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-blue-400" />
          <span>Add Child</span>
        </button>
        {!isRoot && (
          <button
            onClick={() => addSiblingNode(selectedNode.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Sibling</span>
          </button>
        )}
      </div>
    </aside>
  );
};
