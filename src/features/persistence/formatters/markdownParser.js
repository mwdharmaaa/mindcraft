import { Position } from "@xyflow/react";
import { runMindMapLayout } from "@/features/layout/layoutEngine";
function serializeToMarkdown(nodes, edges) {
  if (nodes.length === 0) return "";
  const root = nodes.find((n) => n.data.kind === "root") || nodes[0];
  const childrenMap = /* @__PURE__ */ new Map();
  edges.forEach((edge) => {
    const list = childrenMap.get(edge.source) || [];
    list.push(edge.target);
    childrenMap.set(edge.source, list);
  });
  const lines = [`# ${root.data.label}`];
  const traverse = (nodeId, depth) => {
    const childIds = childrenMap.get(nodeId) || [];
    childIds.forEach((cid) => {
      const child = nodes.find((n) => n.id === cid);
      if (!child) return;
      const indent = "  ".repeat(depth);
      if (child.data.kind === "checklist") {
        lines.push(`${indent}- [ ] ${child.data.label}`);
        (child.data.checklist || []).forEach((item) => {
          lines.push(`${indent}  - [${item.completed ? "x" : " "}] ${item.text}`);
        });
      } else if (child.data.kind === "markdown" && child.data.markdown) {
        lines.push(`${indent}- **${child.data.label}**: ${child.data.markdown}`);
      } else {
        lines.push(`${indent}- ${child.data.label}`);
      }
      traverse(cid, depth + 1);
    });
  };
  traverse(root.id, 0);
  return lines.join("\n");
}
function deserializeFromMarkdown(rawText) {
  const rawLines = rawText.split("\n");
  const parsedItems = [];
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const leadingWhitespace = line.match(/^(\s*)/)?.[1] || "";
    let indentDepth = 0;
    for (const char of leadingWhitespace) {
      if (char === "	") indentDepth += 2;
      else if (char === " ") indentDepth += 0.5;
    }
    const depth = Math.floor(indentDepth);
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const headingLevel = headingMatch[1].length - 1;
      parsedItems.push({
        depth: headingLevel,
        label: headingMatch[2].trim(),
        kind: headingLevel === 0 ? "root" : "topic"
      });
      continue;
    }
    const contentMatch = trimmed.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, "");
    const checkMatch = contentMatch.match(/^\[([ xX])\]\s+(.*)$/);
    if (checkMatch) {
      const isCompleted = checkMatch[1].toLowerCase() === "x";
      const text = checkMatch[2].trim();
      parsedItems.push({
        depth: depth + 1,
        label: text,
        kind: "checklist",
        checklist: [{ id: `chk-${Date.now()}-${Math.random()}`, text, completed: isCompleted }]
      });
      continue;
    }
    const docMatch = contentMatch.match(/^\*\*(.*?)\*\*:\s*(.*)$/);
    if (docMatch) {
      parsedItems.push({
        depth: depth + 1,
        label: docMatch[1].trim(),
        kind: "markdown",
        markdown: docMatch[2].trim()
      });
      continue;
    }
    parsedItems.push({
      depth: depth + 1,
      label: contentMatch,
      kind: "topic"
    });
  }
  if (parsedItems.length === 0) return null;
  if (parsedItems[0].kind !== "root") {
    parsedItems[0].kind = "root";
    parsedItems[0].depth = 0;
  }
  const nodes = [];
  const edges = [];
  const stack = [];
  parsedItems.forEach((item, index) => {
    const id = `node-md-${Date.now()}-${index}`;
    const isRoot = item.kind === "root";
    while (stack.length > 0 && stack[stack.length - 1].depth >= item.depth) {
      stack.pop();
    }
    const parent = stack.length > 0 ? stack[stack.length - 1] : null;
    const node = {
      id,
      type: isRoot ? "root" : item.kind,
      position: { x: item.depth * 260, y: index * 85 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        label: item.label,
        kind: isRoot ? "root" : item.kind,
        color: isRoot ? "#f4f4f5" : "#d4d4d8",
        priority: "none",
        parentId: parent ? parent.id : null,
        checklist: item.checklist || [],
        markdown: item.markdown || "",
        shape: "rounded"
      }
    };
    nodes.push(node);
    if (parent) {
      edges.push({
        id: `e-${parent.id}-${id}`,
        source: parent.id,
        target: id,
        sourceHandle: "source-r",
        targetHandle: "target-l",
        type: "smoothstep",
        style: { stroke: "#71717a", strokeWidth: 1.5 }
      });
    }
    stack.push({ id, depth: item.depth });
  });
  return runMindMapLayout(nodes, edges, "LR");
}
export {
  deserializeFromMarkdown,
  serializeToMarkdown
};
