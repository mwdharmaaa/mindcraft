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

// 61. project.types.ts
writeFile(
  'src/features/projects/types/project.types.ts',
  `export interface ProjectMeta {
  id: string;
  name: string;
  nodeCount: number;
  updatedAt: number;
  createdAt: number;
}

export interface ProjectStorageItem {
  meta: ProjectMeta;
  data: {
    nodes: unknown[];
    edges: unknown[];
  };
}
`
);
commit(['src/features/projects/types/project.types.ts'], 'feat(projects): define ProjectMeta and ProjectStorageSchema contracts');

// 62. projectStorage.ts
writeFile(
  'src/features/projects/services/projectStorage.ts',
  `import { ProjectMeta } from '../types/project.types';

const INDEX_KEY = 'mindcraft_projects_index_v1';
const PROJECT_PREFIX = 'mindcraft_project_data_';

export function getProjectList(): ProjectMeta[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(INDEX_KEY) : null;
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProjectMetaList(list: ProjectMeta[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  } catch {
    // quota
  }
}

export function saveProjectData(id: string, nodes: unknown[], edges: unknown[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(\`\${PROJECT_PREFIX}\${id}\`, JSON.stringify({ nodes, edges }));
  } catch {
    // quota
  }
}

export function loadProjectData(id: string): { nodes: unknown[]; edges: unknown[] } | null {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(\`\${PROJECT_PREFIX}\${id}\`) : null;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function removeProjectData(id: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(\`\${PROJECT_PREFIX}\${id}\`);
  } catch {
    // cleanup
  }
}
`
);
commit(['src/features/projects/services/projectStorage.ts'], 'feat(projects): implement projectStorage CRUD service in localStorage');

// 63. ProjectListItem.tsx
writeFile(
  'src/features/projects/components/ProjectListItem.tsx',
  `import React from 'react';
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
      className={\`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all \${
        isActive
          ? 'bg-zinc-800/90 border-zinc-600 text-zinc-100 shadow-md'
          : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850'
      }\`}
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
`
);
commit(['src/features/projects/components/ProjectListItem.tsx'], 'feat(projects): create ProjectListItem row component with node count and actions');

// 64. NewProjectDialog.tsx
writeFile(
  'src/features/projects/components/NewProjectDialog.tsx',
  `import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-100">Create New Mind Map</h3>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. System Architecture, Story Outline..."
            autoFocus
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-zinc-400 placeholder:text-zinc-500"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-200 hover:bg-white text-zinc-950 rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
`
);
commit(['src/features/projects/components/NewProjectDialog.tsx'], 'feat(projects): create NewProjectDialog prompt for naming new mind map');

// 65. ProjectListModal.tsx
writeFile(
  'src/features/projects/components/ProjectListModal.tsx',
  `import React, { useState } from 'react';
import { ProjectListItem } from './ProjectListItem';
import { NewProjectDialog } from './NewProjectDialog';
import { getProjectList, removeProjectData, saveProjectMetaList } from '../services/projectStorage';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { FolderKanban, Plus, X } from 'lucide-react';

interface ProjectListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectListModal: React.FC<ProjectListModalProps> = ({ isOpen, onClose }) => {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const activeProjectId = useMindMapStore((s) => s.activeProjectId);
  const switchProject = useMindMapStore((s) => s.switchProject);
  const createProject = useMindMapStore((s) => s.createProject);
  const deleteProject = useMindMapStore((s) => s.deleteProject);

  if (!isOpen) return null;

  const projects = getProjectList();

  const handleSelect = (id: string) => {
    switchProject(id);
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteProject(id);
  };

  const handleCreateNew = (name: string) => {
    createProject(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
          {projects.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              No saved workspaces found. Create your first project below.
            </div>
          ) : (
            projects.map((proj) => (
              <ProjectListItem
                key={proj.id}
                project={proj}
                isActive={proj.id === activeProjectId}
                onSelect={() => handleSelect(proj.id)}
                onDelete={(e) => handleDelete(e, proj.id)}
              />
            ))
          )}
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">
            {projects.length} map{projects.length === 1 ? '' : 's'}
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
    </div>
  );
};
`
);
commit(['src/features/projects/components/ProjectListModal.tsx'], 'feat(projects): create ProjectListModal workspace manager dialog');

// 66. Add project metadata to mindMapStore.types.ts
const typesPath = path.join(ROOT, 'src/features/canvas/store/mindMapStore.types.ts');
let typesContent = fs.readFileSync(typesPath, 'utf8');
typesContent = typesContent.replace(
  '  lastSavedAt: number | null;\n',
  '  lastSavedAt: number | null;\n  activeProjectId: string;\n  isProjectModalOpen: boolean;\n'
);
typesContent = typesContent.replace(
  '  deleteEdge: (edgeId: string) => void;\n',
  `  deleteEdge: (edgeId: string) => void;
  openProjectModal: () => void;
  closeProjectModal: () => void;
  switchProject: (projectId: string) => void;
  createProject: (name: string) => void;
  deleteProject: (projectId: string) => void;\n`
);
fs.writeFileSync(typesPath, typesContent, 'utf8');
commit(['src/features/canvas/store/mindMapStore.types.ts'], 'feat(store): declare activeProject and project actions in store types');

// 67-70. Implement project store actions in mindMapStore.ts
const storePath = path.join(ROOT, 'src/features/canvas/store/mindMapStore.ts');
let storeContent = fs.readFileSync(storePath, 'utf8');
storeContent = storeContent.replace(
  "import { cloneSubtree } from '@/features/clipboard/utils/cloneSubtree';",
  `import { cloneSubtree } from '@/features/clipboard/utils/cloneSubtree';
import {
  getProjectList,
  saveProjectMetaList,
  saveProjectData,
  loadProjectData,
  removeProjectData,
} from '@/features/projects/services/projectStorage';`
);
storeContent = storeContent.replace(
  '  isSearchOpen: false,\n',
  '  isSearchOpen: false,\n  activeProjectId: "default",\n  isProjectModalOpen: false,\n'
);
storeContent = storeContent.replace(
  '  importMindMap: (nodes, edges) => {',
  `  openProjectModal: () => set({ isProjectModalOpen: true }),
  closeProjectModal: () => set({ isProjectModalOpen: false }),

  switchProject: (projectId) => {
    const loaded = loadProjectData(projectId);
    if (loaded && Array.isArray(loaded.nodes) && Array.isArray(loaded.edges)) {
      persistCanvas(loaded.nodes as any, loaded.edges as any);
      set({
        activeProjectId: projectId,
        nodes: loaded.nodes as any,
        edges: loaded.edges as any,
        selectedNodeId: null,
        history: [{ nodes: loaded.nodes as any, edges: loaded.edges as any }],
        historyIndex: 0,
        lastSavedAt: Date.now(),
      });
    }
  },

  createProject: (name) => {
    const state = get();
    const newId = \`proj-\${Date.now()}\`;
    const blankRoot: any = {
      id: 'root-1',
      type: 'root',
      position: { x: 400, y: 300 },
      data: {
        label: name,
        kind: 'root',
        color: '#f4f4f5',
        priority: 'high',
      },
    };

    saveProjectData(newId, [blankRoot], []);
    const projects = getProjectList();
    projects.push({
      id: newId,
      name,
      nodeCount: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    saveProjectMetaList(projects);

    persistCanvas([blankRoot], []);
    set({
      activeProjectId: newId,
      nodes: [blankRoot],
      edges: [],
      selectedNodeId: 'root-1',
      history: [{ nodes: [blankRoot], edges: [] }],
      historyIndex: 0,
      lastSavedAt: Date.now(),
    });
  },

  deleteProject: (projectId) => {
    removeProjectData(projectId);
    const projects = getProjectList().filter((p) => p.id !== projectId);
    saveProjectMetaList(projects);

    const state = get();
    if (state.activeProjectId === projectId) {
      state.resetCanvas();
      set({ activeProjectId: 'default' });
    }
  },

  importMindMap: (nodes, edges) => {`
);
fs.writeFileSync(storePath, storeContent, 'utf8');
commit(['src/features/canvas/store/mindMapStore.ts'], 'feat(store): implement switchProject createProject and deleteProject actions');

// 71. Add FolderKanban button in CanvasActionButtons.tsx
const actionButtonsPath = path.join(ROOT, 'src/features/toolbar/components/header/CanvasActionButtons.tsx');
let actionButtonsContent = fs.readFileSync(actionButtonsPath, 'utf8');
actionButtonsContent = actionButtonsContent.replace(
  "import { Share2, Keyboard, FilePlus, RotateCcw, Search } from 'lucide-react';",
  "import { Share2, Keyboard, FilePlus, RotateCcw, Search, FolderKanban } from 'lucide-react';"
);
actionButtonsContent = actionButtonsContent.replace(
  '  onSearch?: () => void;\n}',
  '  onSearch?: () => void;\n  onProjects?: () => void;\n}'
);
actionButtonsContent = actionButtonsContent.replace(
  '  onSearch,\n}) => {',
  '  onSearch,\n  onProjects,\n}) => {'
);
actionButtonsContent = actionButtonsContent.replace(
  '      <button\n        onClick={onExport}',
  `      {onProjects && (
        <button
          onClick={onProjects}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Manage workspaces"
        >
          <FolderKanban className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={onExport}`
);
fs.writeFileSync(actionButtonsPath, actionButtonsContent, 'utf8');

const topNavPath = path.join(ROOT, 'src/features/toolbar/components/TopNavigation.tsx');
let topNavContent = fs.readFileSync(topNavPath, 'utf8');
topNavContent = topNavContent.replace(
  '    openSearch,\n  } = useMindMapStore();',
  '    openSearch,\n    openProjectModal,\n  } = useMindMapStore();'
);
topNavContent = topNavContent.replace(
  '          onSearch={openSearch}\n        />',
  '          onSearch={openSearch}\n          onProjects={openProjectModal}\n        />'
);
fs.writeFileSync(topNavPath, topNavContent, 'utf8');
commit(
  ['src/features/toolbar/components/header/CanvasActionButtons.tsx', 'src/features/toolbar/components/TopNavigation.tsx'],
  'feat(toolbar): add project manager button in top navigation bar'
);

// 72. Mount ProjectListModal in App.tsx
const appPath = path.join(ROOT, 'src/app/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(
  "import { SearchModal } from '@/features/search/components/SearchModal';",
  `import { SearchModal } from '@/features/search/components/SearchModal';
import { ProjectListModal } from '@/features/projects/components/ProjectListModal';`
);
appContent = appContent.replace(
  'const { isSearchOpen, closeSearch } = useMindMapStore();',
  'const { isSearchOpen, closeSearch, isProjectModalOpen, closeProjectModal } = useMindMapStore();'
);
appContent = appContent.replace(
  '      <SearchModal\n        isOpen={isSearchOpen}\n        onClose={closeSearch}\n      />',
  `      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />

      <ProjectListModal
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
      />`
);
fs.writeFileSync(appPath, appContent, 'utf8');
commit(['src/app/App.tsx'], 'feat(app): mount ProjectListModal in App root component');

console.log('Batch 6 complete: 12 commits added.');
