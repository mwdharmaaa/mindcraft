import React from 'react';
import { ConnectorType } from '@/features/canvas/store/mindMapStore.types';

interface ConnectorSelectorProps {
  current: ConnectorType;
  onChange: (type: ConnectorType) => void;
}

export const ConnectorSelector: React.FC<ConnectorSelectorProps> = ({ current, onChange }) => {
  return (
    <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
      {(['smoothstep', 'bezier', 'straight'] as ConnectorType[]).map((conn) => (
        <button
          key={conn}
          onClick={() => onChange(conn)}
          className={`px-2.5 py-1 text-xs rounded-lg capitalize transition-all ${
            current === conn
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-600 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          {conn === 'smoothstep' ? 'Step' : conn}
        </button>
      ))}
    </div>
  );
};
