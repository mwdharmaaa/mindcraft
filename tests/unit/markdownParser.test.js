import { describe, test, expect } from "./testRunner.js";
import { serializeToMarkdown, deserializeFromMarkdown } from "../../src/features/persistence/formatters/markdownParser.js";
describe("Markdown Outline Parser", () => {
  test("serializeToMarkdown creates indented outline", () => {
    const nodes = [
      { id: "r", position: { x: 0, y: 0 }, data: { label: "Main Story", kind: "root" } },
      { id: "c1", position: { x: 200, y: 0 }, data: { label: "Act 1", kind: "topic" } }
    ];
    const edges = [{ id: "e1", source: "r", target: "c1" }];
    const md = serializeToMarkdown(nodes, edges);
    expect(md.includes("# Main Story")).toBeTruthy();
    expect(md.includes("- Act 1")).toBeTruthy();
  });
  test("deserializeFromMarkdown parses bullet lists to nodes and edges", () => {
    const input = `# Central Core
- Chapter 1
  - Scene 1
- Chapter 2`;
    const result = deserializeFromMarkdown(input);
    expect(result !== null).toBeTruthy();
    expect(result?.nodes.length).toBe(4);
    expect(result?.edges.length).toBe(3);
  });
});
