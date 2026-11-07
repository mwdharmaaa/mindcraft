import { ProjectMeta } from '../types/project.types';

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
    localStorage.setItem(`${PROJECT_PREFIX}${id}`, JSON.stringify({ nodes, edges }));
  } catch {
    // quota
  }
}

export function loadProjectData(id: string): { nodes: unknown[]; edges: unknown[] } | null {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(`${PROJECT_PREFIX}${id}`) : null;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function removeProjectData(id: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${PROJECT_PREFIX}${id}`);
  } catch {
    // cleanup
  }
}
