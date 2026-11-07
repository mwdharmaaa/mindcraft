const INDEX_KEY = "mindcraft_projects_index_v1";
const PROJECT_PREFIX = "mindcraft_project_data_";
function getProjectList() {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(INDEX_KEY) : null;
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function saveProjectMetaList(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  } catch {
  }
}
function saveProjectData(id, nodes, edges) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PROJECT_PREFIX}${id}`, JSON.stringify({ nodes, edges }));
  } catch {
  }
}
function loadProjectData(id) {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(`${PROJECT_PREFIX}${id}`) : null;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function removeProjectData(id) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${PROJECT_PREFIX}${id}`);
  } catch {
  }
}
export {
  getProjectList,
  loadProjectData,
  removeProjectData,
  saveProjectData,
  saveProjectMetaList
};
