import { describe, test, expect } from "./testRunner";
import { filterNodes } from "../../src/features/search/utils/searchFilter";
describe("Search Filter Algorithm", () => {
  const nodes = [
    { id: "1", data: { label: "World Lore", kind: "topic", tags: ["fantasy", "lore"] } },
    { id: "2", data: { label: "Act Deliverables", kind: "checklist", checklist: [{ id: "c1", text: "Draft prologue" }] } },
    { id: "3", data: { label: "Ancient Spell", kind: "markdown", markdown: "Spell requirements and runes" } }
  ];
  test("matches by label", () => {
    const matches = filterNodes(nodes, "lore");
    expect(matches.length).toBe(1);
    expect(matches[0].node.id).toBe("1");
    expect(matches[0].matchField).toBe("label");
  });
  test("matches by tag", () => {
    const matches = filterNodes(nodes, "fantasy");
    expect(matches.length).toBe(1);
    expect(matches[0].matchField).toBe("tags");
  });
  test("matches by checklist text", () => {
    const matches = filterNodes(nodes, "prologue");
    expect(matches.length).toBe(1);
    expect(matches[0].matchField).toBe("checklist");
  });
  test("matches by markdown content", () => {
    const matches = filterNodes(nodes, "runes");
    expect(matches.length).toBe(1);
    expect(matches[0].matchField).toBe("markdown");
  });
});
