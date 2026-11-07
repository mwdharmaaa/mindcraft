import React, { useState, useEffect } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { MindNodeType } from '@/features/nodes/types/node.types';
import { NodeHandle } from './NodeHandle';
import { NodeEditToolbar } from './NodeEditToolbar';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { NodeTitleInput } from './parts/NodeTitleInput';
import { NodePriorityBadge } from './parts/NodePriorityBadge';
import { NodeTagsBadgeList } from './parts/NodeTagsBadgeList';
import { NodeCollapseButton } from './parts/NodeCollapseButton';
import { NodeAddChildButton } from './parts/NodeAddChildButton';

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
        <NodeCollapseButton
          hasChildren={hasChildren}
          collapsed={data.collapsed}
          onToggle={(e) => {
            e.stopPropagation();
            toggleCollapse(id);
          }}
        />

        <NodeTitleInput
          isEditing={isEditing}
          label={label}
          onChange={setLabel}
          onBlur={handleBlur}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        />

        <NodePriorityBadge priority={data.priority} />

        <NodeTagsBadgeList tags={data.tags} />

        <NodeAddChildButton
          onClick={(e) => {
            e.stopPropagation();
            addChildNode(id);
          }}
        />
      </div>
    </div>
  );
};
