import React, { useState, useEffect } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { MindNodeType } from '@/features/nodes/types/node.types';
import { NodeHandle } from './NodeHandle';
import { NodeEditToolbar } from './NodeEditToolbar';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { FileText, Edit2, Check } from 'lucide-react';

export const MarkdownNode: React.FC<NodeProps<MindNodeType>> = ({ id, data, selected }) => {
  const updateNodeData = useMindMapStore((s) => s.updateNodeData);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.markdown || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(data.label || 'Doc Note');

  useEffect(() => {
    setContent(data.markdown || '');
  }, [data.markdown]);

  useEffect(() => {
    setTitle(data.label || 'Doc Note');
  }, [data.label]);

  const saveContent = () => {
    setIsEditing(false);
    updateNodeData(id, { markdown: content });
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    updateNodeData(id, { label: title.trim() || 'Doc Note' });
  };

  return (
    <div
      className={`relative group w-64 bg-zinc-900 border rounded-xl p-3 shadow-lg transition-all ${
        selected ? 'border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/70' : 'border-zinc-700 hover:border-zinc-500'
      }`}
      style={{ borderLeftColor: data.color || '#d4d4d8', borderLeftWidth: '3px' }}
    >
      <NodeEditToolbar
        nodeId={id}
        isVisible={!!selected}
        currentKind="markdown"
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

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 flex-1 mr-2">
          <FileText className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
              autoFocus
              className="bg-zinc-800 text-zinc-100 text-xs px-1 py-0.5 rounded outline-none border border-zinc-400 w-full"
            />
          ) : (
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className="truncate cursor-text"
              title="Double click to edit title"
            >
              {data.label || 'Doc Note'}
            </span>
          )}
        </div>
        <button
          onClick={() => (isEditing ? saveContent() : setIsEditing(true))}
          className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded hover:bg-zinc-800"
          title={isEditing ? 'Save note' : 'Edit note'}
        >
          {isEditing ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Edit2 className="w-3 h-3 text-zinc-400" />}
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write documentation or note here..."
          rows={4}
          autoFocus
          className="w-full bg-zinc-800/90 text-zinc-200 text-xs p-2 rounded outline-none border border-zinc-500 font-mono resize-none placeholder:text-zinc-500"
        />
      ) : (
        <div
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className={`text-xs leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto cursor-text select-text ${
            data.markdown ? 'text-zinc-300 font-sans' : 'text-zinc-500 italic'
          }`}
        >
          {data.markdown || 'Empty note. Double-click to write documentation...'}
        </div>
      )}
    </div>
  );
};
