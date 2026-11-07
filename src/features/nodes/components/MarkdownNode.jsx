import { useState, useEffect } from "react";
import { Position } from "@xyflow/react";
import { NodeHandle } from "./NodeHandle";
import { NodeEditToolbar } from "./NodeEditToolbar";
import { useMindMapStore } from "@/features/canvas/store/mindMapStore";
import { MarkdownHeader } from "./markdown/MarkdownHeader";
import { MarkdownViewer } from "./markdown/MarkdownViewer";
import { MarkdownEditor } from "./markdown/MarkdownEditor";
import { NodeTagsBadgeList } from "./parts/NodeTagsBadgeList";
const MarkdownNode = ({ id, data, selected }) => {
  const updateNodeData = useMindMapStore((s) => s.updateNodeData);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.markdown || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(data.label || "Doc Note");
  useEffect(() => {
    setContent(data.markdown || "");
  }, [data.markdown]);
  useEffect(() => {
    setTitle(data.label || "Doc Note");
  }, [data.label]);
  const saveContent = () => {
    setIsEditing(false);
    updateNodeData(id, { markdown: content });
  };
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    updateNodeData(id, { label: title.trim() || "Doc Note" });
  };
  return <div
    className={`relative group w-64 bg-zinc-900 border rounded-xl p-3 shadow-lg transition-all ${selected ? "border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/70" : "border-zinc-700 hover:border-zinc-500"}`}
    style={{ borderLeftColor: data.color || "#d4d4d8", borderLeftWidth: "3px" }}
  >
      <NodeEditToolbar
    nodeId={id}
    isVisible={!!selected}
    currentKind="markdown"
    currentShape={data.shape}
  />

      <NodeHandle type="target" position={Position.Left} id="target-l" />
      <NodeHandle type="source" position={Position.Left} id="source-l" />
      <NodeHandle type="target" position={Position.Right} id="target-r" />
      <NodeHandle type="source" position={Position.Right} id="source-r" />
      <NodeHandle type="target" position={Position.Top} id="target-t" />
      <NodeHandle type="source" position={Position.Top} id="source-t" />
      <NodeHandle type="target" position={Position.Bottom} id="target-b" />
      <NodeHandle type="source" position={Position.Bottom} id="source-b" />

      <MarkdownHeader
    label={title}
    isEditing={isEditing}
    isEditingTitle={isEditingTitle}
    onTitleChange={setTitle}
    onTitleBlur={handleTitleBlur}
    onTitleDoubleClick={(e) => {
      e.stopPropagation();
      setIsEditingTitle(true);
    }}
    onToggleContentEdit={() => isEditing ? saveContent() : setIsEditing(true)}
  />

      {isEditing ? <MarkdownEditor value={content} onChange={setContent} /> : <MarkdownViewer
    markdown={data.markdown}
    onDoubleClick={(e) => {
      e.stopPropagation();
      setIsEditing(true);
    }}
  />}

      <div className="mt-2.5 pt-2 border-t border-zinc-800">
        <NodeTagsBadgeList tags={data.tags} />
      </div>
    </div>;
};
export {
  MarkdownNode
};
