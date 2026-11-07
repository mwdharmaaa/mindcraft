import React, { useState } from 'react';
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
