import React from 'react';
import { ProjectMeta } from '../types/project.types';
import { Network, Trash2 } from 'lucide-react';

interface ProjectListItemProps {
  project: ProjectMeta;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  isActive,
  onSelect,
  onDelete,
}) => {
  const formattedDate = new Date(project.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${
        isActive
          ? 'bg-zinc-800/90 border-zinc-600 text-zinc-100 shadow-md'
          : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
          <Network className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-zinc-100">{project.name}</h4>
            {isActive && (
              <span className="text-[9px] font-mono uppercase bg-zinc-200 text-zinc-950 font-bold px-1.5 py-0.2 rounded">
                Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {project.nodeCount} cards &bull; Updated {formattedDate}
          </p>
        </div>
      </div>
      {!isActive && (
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          title="Delete project"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
