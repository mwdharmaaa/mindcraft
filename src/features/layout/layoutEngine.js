import { calculateDagreLayout } from "./algorithms/dagreTreeLayout";
import { calculateRadialLayout } from "./algorithms/radialLayout";
function runMindMapLayout(nodes, edges, direction) {
  if (direction === "RADIAL") {
    return calculateRadialLayout(nodes, edges);
  }
  return calculateDagreLayout(nodes, edges, direction);
}
export {
  runMindMapLayout
};
