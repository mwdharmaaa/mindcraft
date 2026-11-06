import React, { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';

export const CanvasWheelController: React.FC = () => {
  const { getViewport, setViewport } = useReactFlow();
  const scrollMode = useMindMapStore((s) => s.scrollMode);

  useEffect(() => {
    const container = document.querySelector('.react-flow') as HTMLElement | null;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow form inputs and dropdowns to scroll normally
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [data-no-wheel]')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const viewport = getViewport();

      // Trackpad 2-finger pinch gesture sets ctrlKey = true in modern browsers
      if (e.ctrlKey) {
        const factor = Math.exp(-e.deltaY * 0.008);
        const nextZoom = Math.min(Math.max(viewport.zoom * factor, 0.15), 2.5);

        const rect = container.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        const newX = cursorX - (cursorX - viewport.x) * (nextZoom / viewport.zoom);
        const newY = cursorY - (cursorY - viewport.y) * (nextZoom / viewport.zoom);

        setViewport({ x: newX, y: newY, zoom: nextZoom });
        return;
      }

      // Normal wheel scrolling or 2-finger trackpad pan: slides/pans the canvas without zooming
      const speed = 1.2;
      let dx = 0;
      let dy = 0;

      if (scrollMode === 'horizontal') {
        if (e.shiftKey) {
          // Shift + wheel scrolls vertically
          dy = -e.deltaY * speed;
        } else if (Math.abs(e.deltaX) > 0) {
          // Trackpad 2-finger pan with horizontal delta
          dx = -e.deltaX * speed;
          dy = -e.deltaY * speed;
        } else {
          // Standard single-axis mouse wheel maps to horizontal slide
          dx = -e.deltaY * speed;
        }
      } else if (scrollMode === 'vertical') {
        if (e.shiftKey) {
          dx = -e.deltaY * speed;
        } else if (Math.abs(e.deltaX) > 0) {
          dx = -e.deltaX * speed;
          dy = -e.deltaY * speed;
        } else {
          dy = -e.deltaY * speed;
        }
      } else {
        // Free panning mode
        dx = -e.deltaX * speed;
        dy = -e.deltaY * speed;
      }

      setViewport({
        x: viewport.x + dx,
        y: viewport.y + dy,
        zoom: viewport.zoom,
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [getViewport, setViewport, scrollMode]);

  return null;
};
