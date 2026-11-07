import { Handle } from "@xyflow/react";
const NodeHandle = ({
  type,
  position,
  id,
  isConnectable = true
}) => {
  return <Handle
    type={type}
    position={position}
    id={id}
    isConnectable={isConnectable}
    className="!w-2.5 !h-2.5 !bg-zinc-300 !border-2 !border-zinc-900 hover:!bg-white hover:!scale-125 transition-all duration-150 !rounded-full shadow-sm"
  />;
};
export {
  NodeHandle
};
