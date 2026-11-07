import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve('project/web/mindcraft');
const GIT = 'C:\\Program Files\\Git\\cmd\\git.exe';

function commit(files, message) {
  const fileArgs = files.map((f) => `"${f}"`).join(' ');
  execSync(`"${GIT}" -C "${ROOT}" add ${fileArgs}`, { stdio: 'pipe' });
  execSync(`"${GIT}" -C "${ROOT}" commit -m "${message}"`, { stdio: 'pipe' });
  console.log(`[COMMIT] ${message}`);
}

function writeFile(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// 1. NodeTitleInput.tsx
writeFile(
  'src/features/nodes/components/parts/NodeTitleInput.tsx',
  `import React from 'react';

interface NodeTitleInputProps {
  isEditing: boolean;
  label: string;
  placeholder?: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  onDoubleClick: (e: React.MouseEvent) => void;
}

export const NodeTitleInput: React.FC<NodeTitleInputProps> = ({
  isEditing,
  label,
  placeholder = 'Empty card - double click to type',
  onChange,
  onBlur,
  onDoubleClick,
}) => {
  if (isEditing) {
    return (
      <input
        type="text"
        value={label}
        placeholder="Type note title..."
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => e.key === 'Enter' && onBlur()}
        autoFocus
        className="bg-zinc-800 text-zinc-100 text-xs px-1.5 py-0.5 rounded outline-none border border-zinc-400 min-w-[120px] placeholder:text-zinc-500"
      />
    );
  }

  return (
    <span
      onDoubleClick={onDoubleClick}
      className={\`text-xs select-text cursor-text \${
        label ? 'font-medium text-zinc-200' : 'italic text-zinc-500'
      }\`}
    >
      {label || placeholder}
    </span>
  );
};
`
);
commit(['src/features/nodes/components/parts/NodeTitleInput.tsx'], 'feat(nodes): extract NodeTitleInput inline editor component');

// 2. NodePriorityBadge.tsx
writeFile(
  'src/features/nodes/components/parts/NodePriorityBadge.tsx',
  `import React from 'react';
import { NodePriority } from '@/features/nodes/types/node.types';

interface NodePriorityBadgeProps {
  priority?: NodePriority;
}

export const NodePriorityBadge: React.FC<NodePriorityBadgeProps> = ({ priority }) => {
  if (!priority || priority === 'none') return null;

  const styleClass =
    priority === 'urgent'
      ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-200'
      : priority === 'high'
      ? 'bg-zinc-700 text-zinc-100 border border-zinc-600'
      : 'bg-zinc-800 text-zinc-400 border border-zinc-700';

  return (
    <span className={\`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded \${styleClass}\`}>
      {priority}
    </span>
  );
};
`
);
commit(['src/features/nodes/components/parts/NodePriorityBadge.tsx'], 'feat(nodes): extract NodePriorityBadge visual component');

// 3. NodeTagsBadgeList.tsx
writeFile(
  'src/features/nodes/components/parts/NodeTagsBadgeList.tsx',
  `import React from 'react';

interface NodeTagsBadgeListProps {
  tags?: string[];
}

export const NodeTagsBadgeList: React.FC<NodeTagsBadgeListProps> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-[9px] font-mono text-zinc-400 bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};
`
);
commit(['src/features/nodes/components/parts/NodeTagsBadgeList.tsx'], 'feat(nodes): extract NodeTagsBadgeList chip list component');

// 4. NodeCollapseButton.tsx
writeFile(
  'src/features/nodes/components/parts/NodeCollapseButton.tsx',
  `import React from 'react';
import { ChevronRight } from 'lucide-react';

interface NodeCollapseButtonProps {
  hasChildren: boolean;
  collapsed?: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export const NodeCollapseButton: React.FC<NodeCollapseButtonProps> = ({
  hasChildren,
  collapsed,
  onToggle,
}) => {
  if (!hasChildren) return null;

  return (
    <button
      onClick={onToggle}
      className="w-4 h-4 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
      title={collapsed ? 'Expand branch' : 'Collapse branch'}
    >
      <ChevronRight
        className={\`w-3.5 h-3.5 transition-transform duration-150 \${
          collapsed ? 'rotate-0 text-zinc-300' : 'rotate-90'
        }\`}
      />
    </button>
  );
};
`
);
commit(['src/features/nodes/components/parts/NodeCollapseButton.tsx'], 'feat(nodes): extract NodeCollapseButton toggle trigger component');

// 5. NodeAddChildButton.tsx
writeFile(
  'src/features/nodes/components/parts/NodeAddChildButton.tsx',
  `import React from 'react';
import { Plus } from 'lucide-react';

interface NodeAddChildButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const NodeAddChildButton: React.FC<NodeAddChildButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 w-4 h-4 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
      title="Add child card"
    >
      <Plus className="w-3 h-3 text-zinc-300" />
    </button>
  );
};
`
);
commit(['src/features/nodes/components/parts/NodeAddChildButton.tsx'], 'feat(nodes): extract NodeAddChildButton hover trigger component');

// 6. TopicNode.tsx refactor
writeFile(
  'src/features/nodes/components/TopicNode.tsx',
  `import React, { useState, useEffect } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { MindNodeType } from '@/features/nodes/types/node.types';
import { NodeHandle } from './NodeHandle';
import { NodeEditToolbar } from './NodeEditToolbar';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { NodeTitleInput } from './parts/NodeTitleInput';
import { NodePriorityBadge } from './parts/NodePriorityBadge';
import { NodeTagsBadgeList } from './parts/NodeTagsBadgeList';
import { NodeCollapseButton } from './parts/NodeCollapseButton';
import { NodeAddChildButton } from './parts/NodeAddChildButton';

export const TopicNode: React.FC<NodeProps<MindNodeType>> = ({ id, data, selected }) => {
  const { updateNodeData, addChildNode, toggleCollapse, edges } = useMindMapStore();
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');

  useEffect(() => {
    setLabel(data.label || '');
  }, [data.label]);

  const hasChildren = edges.some((e) => e.source === id);

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeData(id, { label: label.trim() });
  };

  const shapeClass =
    data.shape === 'pill'
      ? 'rounded-full px-4 py-2'
      : data.shape === 'rectangle'
      ? 'rounded-none px-3.5 py-2.5'
      : 'rounded-lg px-3.5 py-2.5';

  return (
    <div
      className={\`relative group bg-zinc-900 border transition-all duration-150 shadow-md \${shapeClass} \${
        selected
          ? 'border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/70'
          : 'border-zinc-700 hover:border-zinc-500'
      }\`}
      style={{
        borderLeftColor: data.color || '#d4d4d8',
        borderLeftWidth: '3px',
      }}
    >
      <NodeEditToolbar
        nodeId={id}
        isVisible={!!selected}
        currentKind="topic"
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

      <div className="flex items-center gap-2">
        <NodeCollapseButton
          hasChildren={hasChildren}
          collapsed={data.collapsed}
          onToggle={(e) => {
            e.stopPropagation();
            toggleCollapse(id);
          }}
        />

        <NodeTitleInput
          isEditing={isEditing}
          label={label}
          onChange={setLabel}
          onBlur={handleBlur}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        />

        <NodePriorityBadge priority={data.priority} />

        <NodeTagsBadgeList tags={data.tags} />

        <NodeAddChildButton
          onClick={(e) => {
            e.stopPropagation();
            addChildNode(id);
          }}
        />
      </div>
    </div>
  );
};
`
);
commit(['src/features/nodes/components/TopicNode.tsx'], 'refactor(nodes): compose TopicNode using modular part primitives');

// 7. ChecklistHeader.tsx
writeFile(
  'src/features/nodes/components/checklist/ChecklistHeader.tsx',
  `import React from 'react';
import { CheckSquare } from 'lucide-react';

interface ChecklistHeaderProps {
  label: string;
  isEditing: boolean;
  completedCount: number;
  totalCount: number;
  onTitleChange: (val: string) => void;
  onTitleBlur: () => void;
  onDoubleClick: (e: React.MouseEvent) => void;
}

export const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({
  label,
  isEditing,
  completedCount,
  totalCount,
  onTitleChange,
  onTitleBlur,
  onDoubleClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 flex-1 mr-2">
        <CheckSquare className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && onTitleBlur()}
            autoFocus
            className="bg-zinc-800 text-zinc-100 text-xs px-1 py-0.5 rounded outline-none border border-zinc-400 w-full"
          />
        ) : (
          <span
            onDoubleClick={onDoubleClick}
            className="truncate cursor-text"
            title="Double click to edit title"
          >
            {label || 'Checklist'}
          </span>
        )}
      </div>
      <span className="text-[10px] font-mono text-zinc-400 shrink-0">
        {completedCount}/{totalCount}
      </span>
    </div>
  );
};
`
);
commit(['src/features/nodes/components/checklist/ChecklistHeader.tsx'], 'feat(nodes): extract ChecklistHeader summary component');

// 8. ChecklistProgressBar.tsx
writeFile(
  'src/features/nodes/components/checklist/ChecklistProgressBar.tsx',
  `import React from 'react';

interface ChecklistProgressBarProps {
  percent: number;
}

export const ChecklistProgressBar: React.FC<ChecklistProgressBarProps> = ({ percent }) => {
  return (
    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-2.5">
      <div
        className="h-full bg-zinc-200 transition-all duration-300 rounded-full"
        style={{ width: \`\${percent}%\` }}
      />
    </div>
  );
};
`
);
commit(['src/features/nodes/components/checklist/ChecklistProgressBar.tsx'], 'feat(nodes): extract ChecklistProgressBar progress indicator');

// 9. ChecklistItemRow.tsx
writeFile(
  'src/features/nodes/components/checklist/ChecklistItemRow.tsx',
  `import React from 'react';
import { ChecklistItem } from '@/features/nodes/types/node.types';
import { Trash2 } from 'lucide-react';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({
  item,
  onToggle,
  onRemove,
}) => {
  return (
    <div className="group/item flex items-center justify-between text-xs py-0.5">
      <label className="flex items-center gap-2 cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item.id)}
          className="rounded border-zinc-700 bg-zinc-800 text-zinc-200 focus:ring-0 w-3.5 h-3.5 accent-zinc-200 cursor-pointer"
        />
        <span
          className={\`select-text \${
            item.completed ? 'line-through text-zinc-500' : 'text-zinc-300'
          }\`}
        >
          {item.text}
        </span>
      </label>
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover/item:opacity-100 text-zinc-500 hover:text-zinc-100 transition-opacity p-0.5"
        title="Remove task"
      >
        <Trash2 className="w-3 h-3 text-zinc-400" />
      </button>
    </div>
  );
};
`
);
commit(['src/features/nodes/components/checklist/ChecklistItemRow.tsx'], 'feat(nodes): extract ChecklistItemRow interactive item component');

// 10. ChecklistInputForm.tsx
writeFile(
  'src/features/nodes/components/checklist/ChecklistInputForm.tsx',
  `import React from 'react';
import { Plus } from 'lucide-react';

interface ChecklistInputFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export const ChecklistInputForm: React.FC<ChecklistInputFormProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center gap-1.5">
      <input
        type="text"
        placeholder="New task..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        className="bg-zinc-800/80 text-zinc-200 text-xs px-2 py-1 rounded outline-none border border-transparent focus:border-zinc-400 flex-1 placeholder:text-zinc-500"
      />
      <button
        onClick={onSubmit}
        className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors"
        title="Add task"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
`
);
commit(['src/features/nodes/components/checklist/ChecklistInputForm.tsx'], 'feat(nodes): extract ChecklistInputForm creation form component');

// 11. ChecklistNode.tsx refactor
writeFile(
  'src/features/nodes/components/ChecklistNode.tsx',
  `import React, { useState, useEffect } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { MindNodeType, ChecklistItem } from '@/features/nodes/types/node.types';
import { NodeHandle } from './NodeHandle';
import { NodeEditToolbar } from './NodeEditToolbar';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { ChecklistHeader } from './checklist/ChecklistHeader';
import { ChecklistProgressBar } from './checklist/ChecklistProgressBar';
import { ChecklistItemRow } from './checklist/ChecklistItemRow';
import { ChecklistInputForm } from './checklist/ChecklistInputForm';
import { NodeTagsBadgeList } from './parts/NodeTagsBadgeList';

export const ChecklistNode: React.FC<NodeProps<MindNodeType>> = ({ id, data, selected }) => {
  const updateNodeData = useMindMapStore((s) => s.updateNodeData);
  const [newItemText, setNewItemText] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(data.label || 'Checklist');

  useEffect(() => {
    setTitle(data.label || 'Checklist');
  }, [data.label]);

  const checklist = (data.checklist as ChecklistItem[]) || [];
  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const toggleItem = (itemId: string) => {
    const nextList = checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateNodeData(id, { checklist: nextList });
  };

  const addItem = () => {
    if (!newItemText.trim()) return;
    const nextList: ChecklistItem[] = [
      ...checklist,
      { id: Date.now().toString(), text: newItemText.trim(), completed: false },
    ];
    updateNodeData(id, { checklist: nextList });
    setNewItemText('');
  };

  const removeItem = (itemId: string) => {
    const nextList = checklist.filter((item) => item.id !== itemId);
    updateNodeData(id, { checklist: nextList });
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    updateNodeData(id, { label: title.trim() || 'Checklist' });
  };

  return (
    <div
      className={\`relative group w-64 bg-zinc-900 border rounded-xl p-3 shadow-lg transition-all \${
        selected ? 'border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/70' : 'border-zinc-700 hover:border-zinc-500'
      }\`}
      style={{ borderLeftColor: data.color || '#d4d4d8', borderLeftWidth: '3px' }}
    >
      <NodeEditToolbar
        nodeId={id}
        isVisible={!!selected}
        currentKind="checklist"
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

      <ChecklistHeader
        label={title}
        isEditing={isEditingTitle}
        completedCount={completedCount}
        totalCount={checklist.length}
        onTitleChange={setTitle}
        onTitleBlur={handleTitleBlur}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditingTitle(true);
        }}
      />

      <ChecklistProgressBar percent={progressPercent} />

      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {checklist.length === 0 ? (
          <div className="text-[11px] text-zinc-500 italic py-1 text-center">
            No tasks yet. Add a task below.
          </div>
        ) : (
          checklist.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              onToggle={toggleItem}
              onRemove={removeItem}
            />
          ))
        )}
      </div>

      <div className="mt-2">
        <NodeTagsBadgeList tags={data.tags} />
      </div>

      <ChecklistInputForm
        value={newItemText}
        onChange={setNewItemText}
        onSubmit={addItem}
      />
    </div>
  );
};
`
);
commit(['src/features/nodes/components/ChecklistNode.tsx'], 'refactor(nodes): compose ChecklistNode using modular checklist primitives');

// 12. MarkdownHeader.tsx
writeFile(
  'src/features/nodes/components/markdown/MarkdownHeader.tsx',
  `import React from 'react';
import { FileText, Edit2, Check } from 'lucide-react';

interface MarkdownHeaderProps {
  label: string;
  isEditing: boolean;
  isEditingTitle: boolean;
  onTitleChange: (val: string) => void;
  onTitleBlur: () => void;
  onTitleDoubleClick: (e: React.MouseEvent) => void;
  onToggleContentEdit: () => void;
}

export const MarkdownHeader: React.FC<MarkdownHeaderProps> = ({
  label,
  isEditing,
  isEditingTitle,
  onTitleChange,
  onTitleBlur,
  onTitleDoubleClick,
  onToggleContentEdit,
}) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 flex-1 mr-2">
        <FileText className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
        {isEditingTitle ? (
          <input
            type="text"
            value={label}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && onTitleBlur()}
            autoFocus
            className="bg-zinc-800 text-zinc-100 text-xs px-1 py-0.5 rounded outline-none border border-zinc-400 w-full"
          />
        ) : (
          <span
            onDoubleClick={onTitleDoubleClick}
            className="truncate cursor-text"
            title="Double click to edit title"
          >
            {label || 'Doc Note'}
          </span>
        )}
      </div>
      <button
        onClick={onToggleContentEdit}
        className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded hover:bg-zinc-800"
        title={isEditing ? 'Save note' : 'Edit note'}
      >
        {isEditing ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Edit2 className="w-3 h-3 text-zinc-400" />}
      </button>
    </div>
  );
};
`
);
commit(['src/features/nodes/components/markdown/MarkdownHeader.tsx'], 'feat(nodes): extract MarkdownHeader title and edit trigger');

// 13. MarkdownViewer.tsx
writeFile(
  'src/features/nodes/components/markdown/MarkdownViewer.tsx',
  `import React from 'react';

interface MarkdownViewerProps {
  markdown?: string;
  onDoubleClick: (e: React.MouseEvent) => void;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  markdown,
  onDoubleClick,
}) => {
  return (
    <div
      onDoubleClick={onDoubleClick}
      className={\`text-xs leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto cursor-text select-text \${
        markdown ? 'text-zinc-300 font-sans' : 'text-zinc-500 italic'
      }\`}
    >
      {markdown || 'Empty note. Double-click to write documentation...'}
    </div>
  );
};
`
);
commit(['src/features/nodes/components/markdown/MarkdownViewer.tsx'], 'feat(nodes): extract MarkdownViewer formatted content display');

// 14. MarkdownEditor.tsx
writeFile(
  'src/features/nodes/components/markdown/MarkdownEditor.tsx',
  `import React from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write documentation or note here..."
      rows={4}
      autoFocus
      className="w-full bg-zinc-800/90 text-zinc-200 text-xs p-2 rounded outline-none border border-zinc-500 font-mono resize-none placeholder:text-zinc-500"
    />
  );
};
`
);
commit(['src/features/nodes/components/markdown/MarkdownEditor.tsx'], 'feat(nodes): extract MarkdownEditor textarea input component');

// 15. MarkdownNode.tsx refactor
writeFile(
  'src/features/nodes/components/MarkdownNode.tsx',
  `import React, { useState, useEffect } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { MindNodeType } from '@/features/nodes/types/node.types';
import { NodeHandle } from './NodeHandle';
import { NodeEditToolbar } from './NodeEditToolbar';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { MarkdownHeader } from './markdown/MarkdownHeader';
import { MarkdownViewer } from './markdown/MarkdownViewer';
import { MarkdownEditor } from './markdown/MarkdownEditor';
import { NodeTagsBadgeList } from './parts/NodeTagsBadgeList';

export const MarkdownNode: React.FC<NodeProps<MindNodeType>> = ({ id, data, selected }) => {
  const updateNodeData = useMindMapStore((s) => s.updateNodeData);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.markdown || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(data.label || 'Doc Note');

  useEffect(() => {
    setContent(data.markdown || '');
  }, [data.markdown]);

  useEffect(() => {
    setTitle(data.label || 'Doc Note');
  }, [data.label]);

  const saveContent = () => {
    setIsEditing(false);
    updateNodeData(id, { markdown: content });
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    updateNodeData(id, { label: title.trim() || 'Doc Note' });
  };

  return (
    <div
      className={\`relative group w-64 bg-zinc-900 border rounded-xl p-3 shadow-lg transition-all \${
        selected ? 'border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/70' : 'border-zinc-700 hover:border-zinc-500'
      }\`}
      style={{ borderLeftColor: data.color || '#d4d4d8', borderLeftWidth: '3px' }}
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
        onToggleContentEdit={() => (isEditing ? saveContent() : setIsEditing(true))}
      />

      {isEditing ? (
        <MarkdownEditor value={content} onChange={setContent} />
      ) : (
        <MarkdownViewer
          markdown={data.markdown}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        />
      )}

      <div className="mt-2.5 pt-2 border-t border-zinc-800">
        <NodeTagsBadgeList tags={data.tags} />
      </div>
    </div>
  );
};
`
);
commit(['src/features/nodes/components/MarkdownNode.tsx'], 'refactor(nodes): compose MarkdownNode using modular doc primitives');

console.log('Batch 1 complete: 15 commits added.');
