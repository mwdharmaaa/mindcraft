import { useState } from "react";
import { ProjectListItem } from "./ProjectListItem";
import { NewProjectDialog } from "./NewProjectDialog";
import { getProjectList } from "../services/projectStorage";
import { useMindMapStore } from "@/features/canvas/store/mindMapStore";
import { FolderKanban, Plus, X } from "lucide-react";
const ProjectListModal = ({ isOpen, onClose }) => {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const activeProjectId = useMindMapStore((s) => s.activeProjectId);
  const switchProject = useMindMapStore((s) => s.switchProject);
  const createProject = useMindMapStore((s) => s.createProject);
  const deleteProject = useMindMapStore((s) => s.deleteProject);
  if (!isOpen) return null;
  const projects = getProjectList();
  const handleSelect = (id) => {
    switchProject(id);
    onClose();
  };
  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteProject(id);
  };
  const handleCreateNew = (name) => {
    createProject(name);
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-zinc-100">Mind Map Workspaces</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {projects.length === 0 ? <div className="p-6 text-center text-xs text-zinc-500">
              No saved workspaces found. Create your first project below.
            </div> : projects.map((proj) => <ProjectListItem
    key={proj.id}
    project={proj}
    isActive={proj.id === activeProjectId}
    onSelect={() => handleSelect(proj.id)}
    onDelete={(e) => handleDelete(e, proj.id)}
  />)}
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">
            {projects.length} map{projects.length === 1 ? "" : "s"}
          </span>
          <button
    onClick={() => setIsNewOpen(true)}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-200 hover:bg-white text-zinc-950 rounded-lg text-xs font-semibold transition-colors"
  >
            <Plus className="w-3.5 h-3.5" />
            <span>New Workspace</span>
          </button>
        </div>
      </div>

      <NewProjectDialog
    isOpen={isNewOpen}
    onClose={() => setIsNewOpen(false)}
    onCreate={handleCreateNew}
  />
    </div>;
};
export {
  ProjectListModal
};
