import { RootNode } from "./components/RootNode";
import { TopicNode } from "./components/TopicNode";
import { ChecklistNode } from "./components/ChecklistNode";
import { MarkdownNode } from "./components/MarkdownNode";
const nodeTypes = {
  root: RootNode,
  topic: TopicNode,
  checklist: ChecklistNode,
  markdown: MarkdownNode
};
export {
  nodeTypes
};
