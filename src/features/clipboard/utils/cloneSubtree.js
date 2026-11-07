import { getAllDescendantIds } from "@/features/canvas/store/treeHelpers";
function cloneSubtree(sourceRootId, allNodes, allEdges, offset = { x: 50, y: 50 }) {
  const descendantIds = getAllDescendantIds(sourceRootId, allEdges);
  const targetIds = /* @__PURE__ */ new Set([sourceRootId, ...descendantIds]);
  const subtreeNodes = allNodes.filter((n) => targetIds.has(n.id));
  const subtreeEdges = allEdges.filter((e) => targetIds.has(e.source) && targetIds.has(e.target));
  const idMap = /* @__PURE__ */ new Map();
  const timestamp = Date.now();
  subtreeNodes.forEach((node, idx) => {
    idMap.set(node.id, `clone-${timestamp}-${idx}-${Math.floor(Math.random() * 1e3)}`);
  });
  const clonedNodes = subtreeNodes.map((node) => {
    const newId = idMap.get(node.id);
    const isRootOfClone = node.id === sourceRootId;
    return {
      ...node,
      id: newId,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y
      },
      data: {
        ...node.data,
        parentId: isRootOfClone ? void 0 : node.data.parentId ? idMap.get(node.data.parentId) : void 0
      }
    };
  });
  const clonedEdges = subtreeEdges.map((edge) => {
    const newSource = idMap.get(edge.source);
    const newTarget = idMap.get(edge.target);
    return {
      ...edge,
      id: `e-${newSource}-${newTarget}-${timestamp}`,
      source: newSource,
      target: newTarget
    };
  });
  return {
    newRootId: idMap.get(sourceRootId),
    nodes: clonedNodes,
    edges: clonedEdges
  };
}
export {
  cloneSubtree
};
