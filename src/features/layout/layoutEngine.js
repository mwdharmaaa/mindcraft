import { calculateDagreLayout } from "./algorithms/dagreTreeLayout.js";
import { calculateRadialLayout } from "./algorithms/radialLayout.js";
function runMindMapLayout(nodes, edges, direction) {
  if (direction === "RADIAL") {
    return calculateRadialLayout(nodes, edges);
  }
  return calculateDagreLayout(nodes, edges, direction);
}
export {
  runMindMapLayout
};
