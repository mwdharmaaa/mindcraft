import React, { useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { MindNodeType } from '@/features/nodes/types/node.types';
import { NodeHandle } from './NodeHandle';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { FileText, Edit2, Check } from 'lucide-react';

export const MarkdownNode: React.FC<NodeProps<MindNodeType>> = ({ id, data, selected }) => {
  const updateNodeData = useMindMapStore((s) => s.updateNodeData);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.markdown || '');

  const saveContent = () => {
    setIsEditing(false);
    updateNodeData(id, { markdown: content });
  };

  return (
    <div
      className={`relative group w-64 bg-zinc-900 border rounded-xl p-3 shadow-lg transition-all ${
        selected ? 'border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/70' : 'border-zinc-700 hover:border-zinc-500'
      }`}
      style={{ borderLeftColor: data.color || '#e4e4e7', borderLeftWidth: '3px' }}
    >
      <NodeHandle type="target" position={Position.Left} id="target-l" />
      <NodeHandle type="source" position={Position.Left} id="source-l" />
      <NodeHandle type="target" position={Position.Right} id="target-r" />
      <NodeHandle type="source" position={Position.Right} id="source-r" />
      <NodeHandle type="target" position={Position.Top} id="target-t" />
      <NodeHandle type="source" position={Position.Top} id="source-t" />
      <NodeHandle type="target" position={Position.Bottom} id="target-b" />
      <NodeHandle type="source" position={Position.Bottom} id="source-b" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
          <FileText className="w-3.5 h-3.5 text-zinc-300" />
          <span>{data.label}</span>
        </div>
        <button
          onClick={() => (isEditing ? saveContent() : setIsEditing(true))}
          className="text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          {isEditing ? <Check className="w-3.5 h-3.5 text-zinc-300" /> : <Edit2 className="w-3 h-3" />}
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          autoFocus
          className="w-full bg-zinc-800/90 text-zinc-200 text-xs p-2 rounded outline-none border border-zinc-500 font-mono resize-none"
        />
      ) : (
        <div
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="text-xs text-zinc-400 font-sans leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto cursor-text select-text"
        >
          {data.markdown || 'Double click to add detailed notes or documentation...'}
        </div>
      )}
    </div>
  );
};
