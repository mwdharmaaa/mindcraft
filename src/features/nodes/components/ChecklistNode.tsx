import React, { useState } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { MindNodeType, ChecklistItem } from '@/features/nodes/types/node.types';
import { NodeHandle } from './NodeHandle';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

export const ChecklistNode: React.FC<NodeProps<MindNodeType>> = ({ id, data, selected }) => {
  const updateNodeData = useMindMapStore((s) => s.updateNodeData);
  const [newItemText, setNewItemText] = useState('');
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

  return (
    <div
      className={`relative group w-64 bg-zinc-900 border rounded-xl p-3 shadow-lg transition-all ${
        selected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-zinc-800 hover:border-zinc-700'
      }`}
      style={{ borderLeftColor: data.color || '#10b981', borderLeftWidth: '3px' }}
    >
      <NodeHandle type="target" position={Position.Left} id="target-l" />
      <NodeHandle type="target" position={Position.Top} id="target-t" />
      <NodeHandle type="source" position={Position.Right} id="source-r" />
      <NodeHandle type="source" position={Position.Bottom} id="source-b" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
          <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>{data.label}</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          {completedCount}/{checklist.length}
        </span>
      </div>

      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-2.5">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {checklist.map((item) => (
          <div key={item.id} className="group/item flex items-center justify-between text-xs py-0.5">
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
              />
              <span className={`select-text ${item.completed ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>
                {item.text}
              </span>
            </label>
            <button
              onClick={() => removeItem(item.id)}
              className="opacity-0 group-hover/item:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center gap-1.5">
        <input
          type="text"
          placeholder="New task..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          className="bg-zinc-800/80 text-zinc-200 text-xs px-2 py-1 rounded outline-none border border-transparent focus:border-emerald-500 flex-1"
        />
        <button
          onClick={addItem}
          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
