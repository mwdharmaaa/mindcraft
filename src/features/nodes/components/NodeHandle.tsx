import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface NodeHandleProps {
  type: 'source' | 'target';
  position: Position;
  id?: string;
  isConnectable?: boolean;
}

export const NodeHandle: React.FC<NodeHandleProps> = ({
  type,
  position,
  id,
  isConnectable = true,
}) => {
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      isConnectable={isConnectable}
      className="!w-2.5 !h-2.5 !bg-zinc-400 !border-2 !border-zinc-900 hover:!bg-blue-400 transition-colors duration-150 !rounded-full"
    />
  );
};
