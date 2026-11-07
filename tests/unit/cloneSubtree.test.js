import { describe, test, expect } from "./testRunner.js";
import { cloneSubtree } from "../../src/features/clipboard/utils/cloneSubtree.js";
describe("Subtree Cloning", () => {
  test("cloneSubtree creates unique IDs and updates intra-subtree edge mapping", () => {
    const nodes = [
      { id: "p1", position: { x: 0, y: 0 }, data: { label: "Parent" } },
      { id: "c1", position: { x: 200, y: 50 }, data: { label: "Child 1", parentId: "p1" } },
      { id: "c2", position: { x: 200, y: 150 }, data: { label: "Child 2", parentId: "p1" } }
    ];
    const edges = [
      { id: "e1", source: "p1", target: "c1" },
      { id: "e2", source: "p1", target: "c2" }
    ];
    const cloned = cloneSubtree("p1", nodes, edges, { x: 50, y: 50 });
    expect(cloned.newRootId !== "p1").toBeTruthy();
    expect(cloned.nodes.length).toBe(3);
    expect(cloned.edges.length).toBe(2);
    const newIds = new Set(cloned.nodes.map((n) => n.id));
    cloned.edges.forEach((e) => {
      expect(newIds.has(e.source)).toBeTruthy();
      expect(newIds.has(e.target)).toBeTruthy();
    });
  });
});
