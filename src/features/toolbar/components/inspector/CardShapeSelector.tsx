import React from 'react';
import { NodeShape } from '@/features/nodes/types/node.types';

interface CardShapeSelectorProps {
  currentShape?: NodeShape;
  onSelectShape: (shape: NodeShape) => void;
}

export const CardShapeSelector: React.FC<CardShapeSelectorProps> = ({
  currentShape = 'rounded',
  onSelectShape,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-zinc-400">Shape</label>
      <div className="grid grid-cols-3 gap-1 bg-zinc-800/80 p-1 rounded-lg border border-zinc-700">
        {(['rounded', 'pill', 'rectangle'] as NodeShape[]).map((shape) => (
          <button
            key={shape}
            onClick={() => onSelectShape(shape)}
            className={`text-xs py-1 rounded capitalize font-medium transition-all ${
              currentShape === shape
                ? 'bg-zinc-700 text-zinc-100 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {shape}
          </button>
        ))}
      </div>
    </div>
  );
};
