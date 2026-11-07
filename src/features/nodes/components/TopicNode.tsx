import React, { useState, useEffect } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { MindNodeType } from '@/features/nodes/types/node.types';
import { NodeHandle } from './NodeHandle';
import { NodeEditToolbar } from './NodeEditToolbar';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { ChevronRight, Plus } from 'lucide-react';

export const TopicNode: React.FC<NodeProps<MindNodeType>> = ({ id, data, selected }) => {
  const { updateNodeData, addChildNode, toggleCollapse, edges } = useMindMapStore();
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');

  useEffect(() => {
    setLabel(data.label || '');
  }, [data.label]);

  const hasChildren = edges.some((e) => e.source === id);

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeData(id, { label: label.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
  };

  const shapeClass =
    data.shape === 'pill'
      ? 'rounded-full px-4 py-2'
      : data.shape === 'rectangle'
      ? 'rounded-none px-3.5 py-2.5'
      : 'rounded-lg px-3.5 py-2.5';

  return (
    <div
      className={`relative group bg-zinc-900 border transition-all duration-150 shadow-md ${shapeClass} ${
        selected
          ? 'border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/70'
          : 'border-zinc-700 hover:border-zinc-500'
      }`}
      style={{
        borderLeftColor: data.color || '#d4d4d8',
        borderLeftWidth: '3px',
      }}
    >
      <NodeEditToolbar
        nodeId={id}
        isVisible={!!selected}
        currentKind="topic"
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

      <div className="flex items-center gap-2">
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse(id);
            }}
            className="w-4 h-4 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            title={data.collapsed ? 'Expand branch' : 'Collapse branch'}
          >
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform duration-150 ${
                data.collapsed ? 'rotate-0 text-zinc-300' : 'rotate-90'
              }`}
            />
          </button>
        )}

        {isEditing ? (
          <input
            type="text"
            value={label}
            placeholder="Type note title..."
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-zinc-800 text-zinc-100 text-xs px-1.5 py-0.5 rounded outline-none border border-zinc-400 min-w-[120px] placeholder:text-zinc-500"
          />
        ) : (
          <span
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className={`text-xs select-text cursor-text ${
              data.label ? 'font-medium text-zinc-200' : 'italic text-zinc-500'
            }`}
          >
            {data.label || 'Empty card - double click to type'}
          </span>
        )}

        {data.priority && data.priority !== 'none' && (
          <span
            className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
              data.priority === 'urgent'
                ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-200'
                : data.priority === 'high'
                ? 'bg-zinc-700 text-zinc-100 border border-zinc-600'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}
          >
            {data.priority}
          </span>
        )}

        {data.tags && data.tags.length > 0 && (
          <div className="flex items-center gap-1">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono text-zinc-400 bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            addChildNode(id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 w-4 h-4 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          title="Add child card"
        >
          <Plus className="w-3 h-3 text-zinc-300" />
        </button>
      </div>
    </div>
  );
};
