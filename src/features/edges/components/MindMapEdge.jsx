import { useState } from "react";
import {
  BaseEdge,
  getSmoothStepPath,
  getBezierPath,
  getStraightPath,
  EdgeLabelRenderer
} from "@xyflow/react";
import { EdgeDeleteButton } from "./EdgeDeleteButton";
import { useMindMapStore } from "@/features/canvas/store/mindMapStore";
const MindMapEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const connectorType = useMindMapStore((s) => s.connectorType);
  const deleteEdge = useMindMapStore((s) => s.deleteEdge);
  let edgePath = "";
  let labelX = 0;
  let labelY = 0;
  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  };
  if (connectorType === "straight") {
    [edgePath, labelX, labelY] = getStraightPath(pathParams);
  } else if (connectorType === "bezier") {
    [edgePath, labelX, labelY] = getBezierPath(pathParams);
  } else {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      ...pathParams,
      borderRadius: 16
    });
  }
  const edgeStyle = style || {};
  const strokeColor = isHovered ? "#e4e4e7" : edgeStyle.stroke || "#71717a";
  return <g
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
      ...edgeStyle,
      stroke: strokeColor,
      strokeWidth: isHovered ? 2.5 : 1.5,
      transition: "stroke 0.15s, stroke-width 0.15s"
    }}
  />
      {isHovered && <EdgeLabelRenderer>
          <EdgeDeleteButton
    x={labelX}
    y={labelY}
    onClick={(e) => {
      e.stopPropagation();
      deleteEdge(id);
    }}
  />
        </EdgeLabelRenderer>}
    </g>;
};
export {
  MindMapEdge
};
