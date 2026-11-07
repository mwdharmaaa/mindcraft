export interface ProjectMeta {
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
