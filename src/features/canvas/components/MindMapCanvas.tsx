import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Controls,
  MiniMap,
  Background,
  SelectionMode,
  OnSelectionChangeParams,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { nodeTypes } from '@/features/nodes/nodeTypes';
import { edgeTypes } from '@/features/edges/edgeTypes';
import { useKeyboardNavigation } from '@/features/canvas/hooks/useKeyboardNavigation';
import { CanvasWheelController } from './CanvasWheelController';
import { useThemeStore } from '@/features/theme/store/themeStore';
import { CanvasZoomWidget } from './controls/CanvasZoomWidget';

const MindMapCanvasInner: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    addCardAtPosition,
  } = useMindMapStore();

  const { screenToFlowPosition } = useReactFlow();

  useKeyboardNavigation();
  const currentTheme = useThemeStore((s) => s.currentTheme);

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

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          '.react-flow__node, .react-flow__controls, .react-flow__minimap, header, button, [data-no-menu]'
        )
      ) {
        return;
      }

      const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addCardAtPosition(flowPos, 'topic');
    },
    [screenToFlowPosition, addCardAtPosition]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div
      className="w-full h-full relative"
      style={{ backgroundColor: currentTheme.canvasBg }}
      onDoubleClick={handleDoubleClick}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        onSelectionChange={handleSelectionChange}
        selectionMode={SelectionMode.Partial}
        connectionMode={ConnectionMode.Loose}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={true}
        zoomActivationKeyCode={null}
        panOnDrag={[0, 1, 2]}
        fitView
        minZoom={0.15}
        maxZoom={2.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#71717a', strokeWidth: 1.5 },
        }}
        proOptions={{ hideAttribution: true }}
        className="touch-none"
      >
        <CanvasWheelController />

        <Background
          variant={currentTheme.variant}
          gap={currentTheme.dotGap}
          size={currentTheme.dotSize}
          color={currentTheme.dotColor}
        />

        <Controls
          showInteractive={false}
          className="!bg-zinc-900/95 !border !border-zinc-700 !rounded-xl !overflow-hidden !shadow-2xl [&>button]:!bg-zinc-900 [&>button]:!border-zinc-700 [&>button]:!text-zinc-200 hover:[&>button]:!bg-zinc-800"
        />

        <CanvasZoomWidget />

        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            const dataColor = (node.data as { color?: string })?.color;
            return dataColor || '#e4e4e7';
          }}
          maskColor="rgba(9, 9, 11, 0.88)"
          className="!bg-zinc-900 !border !border-zinc-700 !rounded-xl !overflow-hidden !shadow-2xl"
        />
      </ReactFlow>
    </div>
  );
};

export const MindMapCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <MindMapCanvasInner />
    </ReactFlowProvider>
  );
};
