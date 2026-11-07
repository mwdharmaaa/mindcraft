import React from 'react';
import { NodeToolbar, Position } from '@xyflow/react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { NodeTypeKind, NodeShape } from '@/features/nodes/types/node.types';
import {
  FileText,
  CheckSquare,
  Copy,
  AlignLeft,
  Plus,
  Trash2,
  Square,
  Circle,
  RectangleHorizontal,
} from 'lucide-react';

interface NodeEditToolbarProps {
  nodeId: string;
  isVisible: boolean;
  currentKind: NodeTypeKind;
  currentShape?: NodeShape;
}

export const NodeEditToolbar: React.FC<NodeEditToolbarProps> = ({
  nodeId,
  isVisible,
  currentKind,
  currentShape = 'rounded',
}) => {
  const { updateNodeData, addChildNode, duplicateSubtree, deleteSubtree } = useMindMapStore();

  const handleSetKind = (kind: NodeTypeKind) => {
    updateNodeData(nodeId, {
      kind,
      ...(kind === 'checklist' ? { checklist: [] } : {}),
      ...(kind === 'markdown' ? { markdown: '' } : {}),
    });
  };

  const handleCycleShape = () => {
    const nextShape: NodeShape =
      currentShape === 'rounded'
        ? 'pill'
        : currentShape === 'pill'
        ? 'rectangle'
        : 'rounded';
    updateNodeData(nodeId, { shape: nextShape });
  };

  return (
    <NodeToolbar
      isVisible={isVisible}
      position={Position.Top}
      offset={10}
      className="flex items-center gap-1 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl p-1 shadow-2xl select-none"
    >
      <div className="flex items-center gap-0.5 bg-zinc-950/70 p-0.5 rounded-lg border border-zinc-800">
        <button
          onClick={() => handleSetKind('topic')}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded font-medium transition-colors ${
            currentKind === 'topic'
              ? 'bg-zinc-700 text-zinc-100 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
          title="Convert to Note Card"
        >
          <FileText className="w-3 h-3 text-zinc-300" />
          <span>Note</span>
        </button>

        <button
          onClick={() => handleSetKind('checklist')}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded font-medium transition-colors ${
            currentKind === 'checklist'
              ? 'bg-zinc-700 text-zinc-100 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
          title="Convert to Checklist Card"
        >
          <CheckSquare className="w-3 h-3 text-zinc-300" />
          <span>Checklist</span>
        </button>

        <button
          onClick={() => handleSetKind('markdown')}
          className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded font-medium transition-colors ${
            currentKind === 'markdown'
              ? 'bg-zinc-700 text-zinc-100 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
          title="Convert to Doc Card"
        >
          <AlignLeft className="w-3 h-3 text-zinc-300" />
          <span>Doc</span>
        </button>
      </div>

      <div className="w-px h-3.5 bg-zinc-800" />

      <button
        onClick={handleCycleShape}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        title={`Shape: ${currentShape} (Click to cycle)`}
      >
        {currentShape === 'pill' ? (
          <Circle className="w-3.5 h-3.5 text-zinc-300" />
        ) : currentShape === 'rectangle' ? (
          <RectangleHorizontal className="w-3.5 h-3.5 text-zinc-300" />
        ) : (
          <Square className="w-3.5 h-3.5 text-zinc-300" />
        )}
      </button>

      <button
        onClick={() => addChildNode(nodeId)}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        title="Add connected child card (Tab)"
      >
        <Plus className="w-3.5 h-3.5 text-zinc-300" />
      </button>

      <div className="w-px h-3.5 bg-zinc-800" />

      <button
        onClick={() => duplicateSubtree(nodeId)}
        className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        title="Duplicate branch (Ctrl+D)"
      >
        <Copy className="w-3.5 h-3.5 text-zinc-300" />
      </button>

      <button
        onClick={() => deleteSubtree(nodeId)}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        title="Delete card (Del)"
      >
        <Trash2 className="w-3.5 h-3.5 text-zinc-300" />
      </button>
    </NodeToolbar>
  );
};
