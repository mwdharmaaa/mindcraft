function getAllDescendantIds(nodeId, edges) {
  const descendants = /* @__PURE__ */ new Set();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift();
    edges.forEach((edge) => {
      if (edge.source === current && !descendants.has(edge.target)) {
        descendants.add(edge.target);
        queue.push(edge.target);
      }
    });
  }
  return descendants;
}
function buildEdge(sourceId, targetId, _connectorType, color = "#71717a", sourcePos, targetPos) {
  let sourceHandle = "source-r";
  let targetHandle = "target-l";
  if (sourcePos && targetPos) {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx < 0) {
        sourceHandle = "source-l";
        targetHandle = "target-r";
      } else {
        sourceHandle = "source-r";
        targetHandle = "target-l";
      }
    } else {
      if (dy < 0) {
        sourceHandle = "source-t";
        targetHandle = "target-b";
      } else {
        sourceHandle = "source-b";
        targetHandle = "target-t";
      }
    }
  }
  return {
    id: `e-${sourceId}-${targetId}-${Date.now()}`,
    source: sourceId,
    target: targetId,
    sourceHandle,
    targetHandle,
    type: "mindmap",
    style: { stroke: color, strokeWidth: 1.5 }
  };
}
function createNewChildNode(parentId, parent, kind = "topic", customPos) {
  const newId = `node-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
  const parentColor = parent.data.color || "#d4d4d8";
  return {
    id: newId,
    type: kind,
    position: customPos || {
      x: parent.position.x + 240,
      y: parent.position.y + 40
    },
    data: {
      label: "",
      kind,
      color: parentColor,
      parentId,
      shape: "rounded",
      priority: "none",
      checklist: [],
      markdown: ""
    }
  };
}
function calculateChildPosition(parent, count) {
  const offsetX = 250;
  const offsetY = count === 0 ? 0 : count % 2 === 1 ? Math.ceil(count / 2) * 80 : -Math.ceil(count / 2) * 80;
  return {
    x: parent.position.x + offsetX,
    y: parent.position.y + offsetY
  };
}
function calculateSiblingPosition(target) {
  return {
    x: target.position.x,
    y: target.position.y + 80
  };
}
export {
  buildEdge,
  calculateChildPosition,
  calculateSiblingPosition,
  createNewChildNode,
  getAllDescendantIds
};
