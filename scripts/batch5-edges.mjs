import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve('project/web/mindcraft');
const GIT = 'C:\\Program Files\\Git\\cmd\\git.exe';

function commit(files, message) {
  const fileArgs = files.map((f) => `"${f}"`).join(' ');
  execSync(`"${GIT}" -C "${ROOT}" add ${fileArgs}`, { stdio: 'pipe' });
  execSync(`"${GIT}" -C "${ROOT}" commit -m "${message}"`, { stdio: 'pipe' });
  console.log(`[COMMIT] ${message}`);
}

function writeFile(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// 51. edge.types.ts
writeFile(
  'src/features/edges/types/edge.types.ts',
  `import { EdgeProps } from '@xyflow/react';

export interface MindMapEdgeData extends Record<string, unknown> {
  color?: string;
  dashed?: boolean;
  animated?: boolean;
  label?: string;
}

export type MindMapEdgeProps = EdgeProps<MindMapEdgeData>;
`
);
commit(['src/features/edges/types/edge.types.ts'], 'feat(edges): define MindMapEdgeData and custom edge property contracts');

// 52. edgeColor.ts
writeFile(
  'src/features/edges/utils/edgeColor.ts',
  `export function getEdgeStrokeColor(sourceColor?: string, defaultColor = '#71717a'): string {
  if (!sourceColor) return defaultColor;
  return sourceColor;
}

export function getEdgeHoverColor(baseColor = '#71717a'): string {
  return '#e4e4e7';
}
`
);
commit(['src/features/edges/utils/edgeColor.ts'], 'feat(edges): implement edgeColor utility for contrast and handle styling');

// 53. EdgeDeleteButton.tsx
writeFile(
  'src/features/edges/components/EdgeDeleteButton.tsx',
  `import React from 'react';
import { X } from 'lucide-react';

interface EdgeDeleteButtonProps {
  x: number;
  y: number;
  onClick: (e: React.MouseEvent) => void;
}

export const EdgeDeleteButton: React.FC<EdgeDeleteButtonProps> = ({ x, y, onClick }) => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: \`translate(-50%, -50%) translate(\${x}px, \${y}px)\`,
        pointerEvents: 'all',
      }}
      className="nodrag nopan"
    >
      <button
        onClick={onClick}
        className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700 hover:border-rose-500 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-200 flex items-center justify-center transition-all shadow-md"
        title="Disconnect card"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
};
`
);
commit(['src/features/edges/components/EdgeDeleteButton.tsx'], 'feat(edges): create EdgeDeleteButton interactive hover control');

// 54. MindMapEdge.tsx
writeFile(
  'src/features/edges/components/MindMapEdge.tsx',
  `import React, { useState } from 'react';
import {
  BaseEdge,
  getSmoothStepPath,
  getBezierPath,
  getStraightPath,
  EdgeLabelRenderer,
} from '@xyflow/react';
import { MindMapEdgeProps } from '../types/edge.types';
import { EdgeDeleteButton } from './EdgeDeleteButton';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';

export const MindMapEdge: React.FC<MindMapEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const connectorType = useMindMapStore((s) => s.connectorType);
  const deleteEdge = useMindMapStore((s) => s.deleteEdge);

  let edgePath = '';
  let labelX = 0;
  let labelY = 0;

  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  if (connectorType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath(pathParams);
  } else if (connectorType === 'bezier') {
    [edgePath, labelX, labelY] = getBezierPath(pathParams);
  } else {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      ...pathParams,
      borderRadius: 16,
    });
  }

  const strokeColor = isHovered ? '#e4e4e7' : (style.stroke as string) || '#71717a';

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="pointer-events-auto"
      />
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: isHovered ? 2.5 : 1.5,
          transition: 'stroke 0.15s, stroke-width 0.15s',
        }}
      />
      {isHovered && (
        <EdgeLabelRenderer>
          <EdgeDeleteButton
            x={labelX}
            y={labelY}
            onClick={(e) => {
              e.stopPropagation();
              deleteEdge(id);
            }}
          />
        </EdgeLabelRenderer>
      )}
    </g>
  );
};
`
);
commit(['src/features/edges/components/MindMapEdge.tsx'], 'feat(edges): create MindMapEdge custom edge with path rendering and controls');

// 55. edgeTypes.ts
writeFile(
  'src/features/edges/edgeTypes.ts',
  `import { EdgeTypes } from '@xyflow/react';
import { MindMapEdge } from './components/MindMapEdge';

export const edgeTypes: EdgeTypes = {
  mindmap: MindMapEdge,
  smoothstep: MindMapEdge,
  bezier: MindMapEdge,
  straight: MindMapEdge,
};
`
);
commit(['src/features/edges/edgeTypes.ts'], 'feat(edges): create edgeTypes registry for custom React Flow edge mappings');

// 56. Register edgeTypes in MindMapCanvas.tsx
const canvasPath = path.join(ROOT, 'src/features/canvas/components/MindMapCanvas.tsx');
let canvasContent = fs.readFileSync(canvasPath, 'utf8');
canvasContent = canvasContent.replace(
  "import { nodeTypes } from '@/features/nodes/nodeTypes';",
  `import { nodeTypes } from '@/features/nodes/nodeTypes';
import { edgeTypes } from '@/features/edges/edgeTypes';`
);
canvasContent = canvasContent.replace(
  '        nodeTypes={nodeTypes}\n',
  '        nodeTypes={nodeTypes}\n        edgeTypes={edgeTypes}\n'
);
fs.writeFileSync(canvasPath, canvasContent, 'utf8');
commit(['src/features/canvas/components/MindMapCanvas.tsx'], 'feat(canvas): register custom edgeTypes in MindMapCanvas component');

// 57 & 58. Add deleteEdge to mindMapStore.types.ts and mindMapStore.ts
const typesPath = path.join(ROOT, 'src/features/canvas/store/mindMapStore.types.ts');
let typesContent = fs.readFileSync(typesPath, 'utf8');
typesContent = typesContent.replace(
  '  focusNode: (id: string) => void;\n',
  '  focusNode: (id: string) => void;\n  deleteEdge: (edgeId: string) => void;\n'
);
fs.writeFileSync(typesPath, typesContent, 'utf8');
commit(['src/features/canvas/store/mindMapStore.types.ts'], 'feat(store): declare deleteEdge mutation in store types');

const storePath = path.join(ROOT, 'src/features/canvas/store/mindMapStore.ts');
let storeContent = fs.readFileSync(storePath, 'utf8');
storeContent = storeContent.replace(
  '  importMindMap: (nodes, edges) => {',
  `  deleteEdge: (edgeId) => {
    const state = get();
    const nextEdges = state.edges.filter((e) => e.id !== edgeId);
    persistCanvas(state.nodes, nextEdges);

    set({
      edges: nextEdges,
      history: [
        ...state.history.slice(0, state.historyIndex + 1),
        { nodes: state.nodes, edges: nextEdges },
      ],
      historyIndex: state.historyIndex + 1,
      lastSavedAt: Date.now(),
    });
  },

  importMindMap: (nodes, edges) => {`
);
fs.writeFileSync(storePath, storeContent, 'utf8');
commit(['src/features/canvas/store/mindMapStore.ts'], 'feat(store): implement deleteEdge action with history and persistence sync');

// 59. Enhance buildEdge in treeHelpers.ts
const treeHelpersPath = path.join(ROOT, 'src/features/canvas/store/treeHelpers.ts');
let treeHelpersContent = fs.readFileSync(treeHelpersPath, 'utf8');
treeHelpersContent = treeHelpersContent.replace(
  "    type: connectorType,\n    style: { stroke: color, strokeWidth: 1.5 },",
  "    type: 'mindmap',\n    style: { stroke: color, strokeWidth: 1.5 },"
);
fs.writeFileSync(treeHelpersPath, treeHelpersContent, 'utf8');
commit(['src/features/canvas/store/treeHelpers.ts'], 'feat(tree): enhance buildEdge to apply custom edge type and styles');

// 60. Documentation / edge styling test
writeFile(
  'src/features/edges/constants/edgeDefaults.ts',
  `export const EDGE_DEFAULTS = {
  strokeWidth: 1.5,
  activeStrokeWidth: 2.5,
  defaultColor: '#71717a',
  hoverColor: '#e4e4e7',
  borderRadius: 16,
};
`
);
commit(['src/features/edges/constants/edgeDefaults.ts'], 'feat(edges): define EDGE_DEFAULTS styling constants');

console.log('Batch 5 complete: 10 commits added.');
