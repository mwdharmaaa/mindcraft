function serializeToJson(nodes, edges) {
  const payload = {
    version: "1.0.0",
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    nodes,
    edges
  };
  return JSON.stringify(payload, null, 2);
}
function deserializeFromJson(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
export {
  deserializeFromJson,
  serializeToJson
};
