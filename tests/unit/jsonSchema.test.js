import { describe, test, expect } from "./testRunner.js";
import { serializeToJson, deserializeFromJson } from "../../src/features/persistence/formatters/jsonSchema.js";
describe("JSON Schema Persistence", () => {
  test("serializeToJson creates valid export payload", () => {
    const nodes = [{ id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1", kind: "root" } }];
    const edges = [{ id: "e1", source: "1", target: "2" }];
    const json = serializeToJson(nodes, edges);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe("1.0.0");
    expect(Array.isArray(parsed.nodes)).toBeTruthy();
    expect(parsed.nodes.length).toBe(1);
    expect(parsed.edges.length).toBe(1);
  });
  test("deserializeFromJson validates and restores map data", () => {
    const raw = JSON.stringify({
      version: "1.0.0",
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      nodes: [{ id: "n1", position: { x: 10, y: 20 }, data: { label: "Test", kind: "topic" } }],
      edges: []
    });
    const result = deserializeFromJson(raw);
    expect(result !== null).toBeTruthy();
    expect(result?.nodes.length).toBe(1);
  });
  test("deserializeFromJson returns null on malformed JSON", () => {
    expect(deserializeFromJson("invalid json string")).toBe(null);
    expect(deserializeFromJson("{}")).toBe(null);
  });
});
