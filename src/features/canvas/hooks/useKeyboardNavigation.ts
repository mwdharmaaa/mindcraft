import { useEffect } from 'react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';

export function useKeyboardNavigation() {
  const {
    nodes,
    edges,
    selectedNodeId,
    setSelectedNodeId,
    addChildNode,
    addSiblingNode,
    deleteSubtree,
    undo,
    redo,
    openSearch,
  } = useMindMapStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (isInputFocused) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }

      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        openSearch();
        return;
      }

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
        return;
      }

      // Spatial Arrow Keys Navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (nodes.length === 0) return;

        if (!selectedNodeId) {
          const root = nodes.find((n) => n.data.kind === 'root') || nodes[0];
          if (root) {
            e.preventDefault();
            setSelectedNodeId(root.id);
          }
          return;
        }

        const current = nodes.find((n) => n.id === selectedNodeId);
        if (!current) return;

        e.preventDefault();

        if (e.key === 'ArrowRight') {
          // Navigate to first child or nearest rightward node
          const childEdges = edges.filter((edge) => edge.source === current.id);
          if (childEdges.length > 0) {
            const childNodes = childEdges
              .map((edge) => nodes.find((n) => n.id === edge.target))
              .filter((n): n is typeof current => !!n && !n.hidden)
              .sort((a, b) => a.position.y - b.position.y);

            if (childNodes.length > 0) {
              const middleIndex = Math.floor(childNodes.length / 2);
              setSelectedNodeId(childNodes[middleIndex].id);
              return;
            }
          }

          // Fallback: nearest node to the right
          const rightNodes = nodes
            .filter((n) => !n.hidden && n.id !== current.id && n.position.x > current.position.x + 20)
            .sort((a, b) => {
              const distA = Math.hypot(a.position.x - current.position.x, a.position.y - current.position.y);
              const distB = Math.hypot(b.position.x - current.position.x, b.position.y - current.position.y);
              return distA - distB;
            });

          if (rightNodes.length > 0) {
            setSelectedNodeId(rightNodes[0].id);
          }
        } else if (e.key === 'ArrowLeft') {
          // Navigate to parent node
          const parentEdge = edges.find((edge) => edge.target === current.id);
          if (parentEdge) {
            setSelectedNodeId(parentEdge.source);
            return;
          }

          // Fallback: nearest node to the left
          const leftNodes = nodes
            .filter((n) => !n.hidden && n.id !== current.id && n.position.x < current.position.x - 20)
            .sort((a, b) => {
              const distA = Math.hypot(a.position.x - current.position.x, a.position.y - current.position.y);
              const distB = Math.hypot(b.position.x - current.position.x, b.position.y - current.position.y);
              return distA - distB;
            });

          if (leftNodes.length > 0) {
            setSelectedNodeId(leftNodes[0].id);
          }
        } else if (e.key === 'ArrowDown') {
          // Navigate to next sibling below
          const parentEdge = edges.find((edge) => edge.target === current.id);
          if (parentEdge) {
            const siblingEdges = edges.filter((edge) => edge.source === parentEdge.source);
            const siblings = siblingEdges
              .map((edge) => nodes.find((n) => n.id === edge.target))
              .filter((n): n is typeof current => !!n && !n.hidden)
              .sort((a, b) => a.position.y - b.position.y);

            const currentIndex = siblings.findIndex((s) => s.id === current.id);
            if (currentIndex >= 0 && currentIndex < siblings.length - 1) {
              setSelectedNodeId(siblings[currentIndex + 1].id);
              return;
            }
          }

          // Fallback: nearest node below
          const belowNodes = nodes
            .filter((n) => !n.hidden && n.id !== current.id && n.position.y > current.position.y + 10)
            .sort((a, b) => {
              const distA = Math.hypot(a.position.x - current.position.x, a.position.y - current.position.y);
              const distB = Math.hypot(b.position.x - current.position.x, b.position.y - current.position.y);
              return distA - distB;
            });

          if (belowNodes.length > 0) {
            setSelectedNodeId(belowNodes[0].id);
          }
        } else if (e.key === 'ArrowUp') {
          // Navigate to previous sibling above
          const parentEdge = edges.find((edge) => edge.target === current.id);
          if (parentEdge) {
            const siblingEdges = edges.filter((edge) => edge.source === parentEdge.source);
            const siblings = siblingEdges
              .map((edge) => nodes.find((n) => n.id === edge.target))
              .filter((n): n is typeof current => !!n && !n.hidden)
              .sort((a, b) => a.position.y - b.position.y);

            const currentIndex = siblings.findIndex((s) => s.id === current.id);
            if (currentIndex > 0) {
              setSelectedNodeId(siblings[currentIndex - 1].id);
              return;
            }
          }

          // Fallback: nearest node above
          const aboveNodes = nodes
            .filter((n) => !n.hidden && n.id !== current.id && n.position.y < current.position.y - 10)
            .sort((a, b) => {
              const distA = Math.hypot(a.position.x - current.position.x, a.position.y - current.position.y);
              const distB = Math.hypot(b.position.x - current.position.x, b.position.y - current.position.y);
              return distA - distB;
            });

          if (aboveNodes.length > 0) {
            setSelectedNodeId(aboveNodes[0].id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, selectedNodeId, setSelectedNodeId, addChildNode, addSiblingNode, deleteSubtree, undo, redo, openSearch]);
}
