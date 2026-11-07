function exportMindMapToSvg(nodes) {
  if (nodes.length === 0) return "";
  const minX = Math.min(...nodes.map((n) => n.position.x));
  const minY = Math.min(...nodes.map((n) => n.position.y));
  const maxX = Math.max(...nodes.map((n) => n.position.x + 280));
  const maxY = Math.max(...nodes.map((n) => n.position.y + 160));
  const padding = 60;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const nodeElements = nodes.map((n) => {
    const x = n.position.x - minX + padding;
    const y = n.position.y - minY + padding;
    const label = (n.data.label || "Card").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const isRoot = n.data.kind === "root";
    return `
    <g transform="translate(${x}, ${y})">
      <rect width="${isRoot ? 220 : 180}" height="48" rx="8" fill="#18181b" stroke="${n.data.color || "#3f3f46"}" stroke-width="2" />
      <text x="16" y="28" fill="#f4f4f5" font-family="sans-serif" font-size="12" font-weight="${isRoot ? "bold" : "normal"}">${label}</text>
    </g>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#09090b" />
  ${nodeElements}
</svg>`;
}
export {
  exportMindMapToSvg
};
