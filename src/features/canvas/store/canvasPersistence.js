const STORAGE_KEY = "mindcraft_active_canvas_v1";
function loadPersistedCanvas() {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges) && parsed.nodes.length > 0) {
      return { nodes: parsed.nodes, edges: parsed.edges };
    }
  } catch {
  }
  return null;
}
let saveTimer = null;
function persistCanvas(nodes, edges) {
  if (typeof window === "undefined") return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, savedAt: Date.now() }));
    } catch {
    }
  }, 300);
}
function clearPersistedCanvas() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}
export {
  STORAGE_KEY,
  clearPersistedCanvas,
  loadPersistedCanvas,
  persistCanvas
};
