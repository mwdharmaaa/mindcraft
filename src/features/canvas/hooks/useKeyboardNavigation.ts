import { useEffect } from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';

export function useKeyboardNavigation() {
  const {
    selectedNodeId,
    addChildNode,
    addSiblingNode,
    deleteSubtree,
    undo,
    redo,
  } = useMindMapStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (isInputFocused) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (selectedNodeId) {
          addChildNode(selectedNodeId);
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedNodeId) {
          addSiblingNode(selectedNodeId);
        }
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          e.preventDefault();
          deleteSubtree(selectedNodeId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, addChildNode, addSiblingNode, deleteSubtree, undo, redo]);
}
