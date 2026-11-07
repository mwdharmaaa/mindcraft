import { Node, Edge } from '@xyflow/react';
import { MindNodeData } from '@/features/nodes/types/node.types';

export const STORAGE_KEY = 'mindcraft_active_canvas_v1';

export function loadPersistedCanvas(): { nodes: Node<MindNodeData>[]; edges: Edge[] } | null {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges) && parsed.nodes.length > 0) {
      return { nodes: parsed.nodes, edges: parsed.edges };
    }
  } catch {
    // fallback to initial template
  }
  return null;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function persistCanvas(nodes: Node<MindNodeData>[], edges: Edge[]) {
  if (typeof window === 'undefined') return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, savedAt: Date.now() }));
    } catch {
      // quota handling
    }
  }, 300);
}

export function clearPersistedCanvas() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // cleanup fallback
  }
}
