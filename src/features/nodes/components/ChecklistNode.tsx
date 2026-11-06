import React, { useState, useEffect } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { MindNodeType, ChecklistItem } from '@/features/nodes/types/node.types';
import { NodeHandle } from './NodeHandle';
import { NodeEditToolbar } from './NodeEditToolbar';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

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
      className={`relative group w-64 bg-zinc-900 border rounded-xl p-3 shadow-lg transition-all ${
        selected ? 'border-zinc-200 ring-2 ring-zinc-400/25 shadow-zinc-950/70' : 'border-zinc-700 hover:border-zinc-500'
      }`}
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

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 flex-1 mr-2">
          <CheckSquare className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
              autoFocus
              className="bg-zinc-800 text-zinc-100 text-xs px-1 py-0.5 rounded outline-none border border-zinc-400 w-full"
            />
          ) : (
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className="truncate cursor-text"
              title="Double click to edit title"
            >
              {data.label || 'Checklist'}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-zinc-400 shrink-0">
          {completedCount}/{checklist.length}
        </span>
      </div>

      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-2.5">
        <div
          className="h-full bg-zinc-200 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {checklist.length === 0 ? (
          <div className="text-[11px] text-zinc-500 italic py-1 text-center">
            No tasks yet. Add a task below.
          </div>
        ) : (
          checklist.map((item) => (
            <div key={item.id} className="group/item flex items-center justify-between text-xs py-0.5">
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                  className="rounded border-zinc-700 bg-zinc-800 text-zinc-200 focus:ring-0 w-3.5 h-3.5 accent-zinc-200 cursor-pointer"
                />
                <span className={`select-text ${item.completed ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>
                  {item.text}
                </span>
              </label>
              <button
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover/item:opacity-100 text-zinc-500 hover:text-zinc-100 transition-opacity p-0.5"
                title="Remove task"
              >
                <Trash2 className="w-3 h-3 text-zinc-400" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center gap-1.5">
        <input
          type="text"
          placeholder="New task..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          className="bg-zinc-800/80 text-zinc-200 text-xs px-2 py-1 rounded outline-none border border-transparent focus:border-zinc-400 flex-1 placeholder:text-zinc-500"
        />
        <button
          onClick={addItem}
          className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors"
          title="Add task"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
