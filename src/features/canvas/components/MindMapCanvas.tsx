import React, { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  SelectionMode,
  OnSelectionChangeParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { nodeTypes } from '@/features/nodes/nodeTypes';
import { useKeyboardNavigation } from '@/features/canvas/hooks/useKeyboardNavigation';

export const MindMapCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
  } = useMindMapStore();

  useKeyboardNavigation();

  const handleSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      if (params.nodes && params.nodes.length > 0) {
        setSelectedNodeId(params.nodes[0].id);
      } else {
        setSelectedNodeId(null);
      }
    },
    [setSelectedNodeId]
  );

  return (
    <div className="w-full h-full relative bg-[#09090b]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        selectionMode={SelectionMode.Partial}
        fitView
        minZoom={0.15}
        maxZoom={2.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#475569', strokeWidth: 1.5 },
        }}
        proOptions={{ hideAttribution: true }}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="rgba(255, 255, 255, 0.08)"
        />

        <Controls
          showInteractive={false}
          className="!bg-zinc-900 !border !border-zinc-800 !rounded-xl !overflow-hidden !shadow-xl [&>button]:!bg-zinc-900 [&>button]:!border-zinc-800 [&>button]:!text-zinc-300 hover:[&>button]:!bg-zinc-800"
        />

        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            const dataColor = (node.data as { color?: string })?.color;
            return dataColor || '#3b82f6';
          }}
          maskColor="rgba(9, 9, 11, 0.85)"
          className="!bg-zinc-900 !border !border-zinc-800 !rounded-xl !overflow-hidden !shadow-xl"
        />
      </ReactFlow>
    </div>
  );
};
