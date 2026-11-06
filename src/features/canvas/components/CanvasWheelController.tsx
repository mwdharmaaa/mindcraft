import React, { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useMindMapStore } from '@/features/canvas/store/mindMapStore';

export const CanvasWheelController: React.FC = () => {
  const { getViewport, setViewport } = useReactFlow();
  const layoutDirection = useMindMapStore((s) => s.layoutDirection);

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

      // 1. ZOOM DETECTION:
      // Trackpad 2-finger pinch (or Ctrl + mouse wheel) sets e.ctrlKey = true in all modern browsers
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

      // 2. SCROLL / PAN DETECTION:
      // Normal wheel scrolling or 2-finger trackpad pan (e.ctrlKey is false)
      const speed = 1.15;
      let dx = 0;
      let dy = 0;

      if (Math.abs(e.deltaX) > 0) {
        // Trackpad 2-finger pan or horizontal mouse tilt wheel (fluid 2D panning)
        dx = -e.deltaX * speed;
        dy = -e.deltaY * speed;
      } else {
        // Single-axis mouse wheel:
        // Automatically slides along tree expansion axis (horizontal for LR/Radial, vertical for TB)
        const isHorizontal = layoutDirection !== 'TB';

        if (e.shiftKey) {
          if (isHorizontal) {
            dy = -e.deltaY * speed;
          } else {
            dx = -e.deltaY * speed;
          }
        } else {
          if (isHorizontal) {
            dx = -e.deltaY * speed;
          } else {
            dy = -e.deltaY * speed;
          }
        }
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
  }, [getViewport, setViewport, layoutDirection]);

  return null;
};
