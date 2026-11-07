import { useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
const CanvasWheelController = () => {
  const { getViewport, setViewport } = useReactFlow();
  useEffect(() => {
    const container = document.querySelector(".react-flow");
    if (!container) return;
    const handleWheel = (e) => {
      const target = e.target;
      if (target?.closest("input, textarea, select, [data-no-wheel]")) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const viewport = getViewport();
      if (e.ctrlKey) {
        const factor = Math.exp(-e.deltaY * 8e-3);
        const nextZoom = Math.min(Math.max(viewport.zoom * factor, 0.15), 2.5);
        const rect = container.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        const newX = cursorX - (cursorX - viewport.x) * (nextZoom / viewport.zoom);
        const newY = cursorY - (cursorY - viewport.y) * (nextZoom / viewport.zoom);
        setViewport({ x: newX, y: newY, zoom: nextZoom });
        return;
      }
      const speed = 1.15;
      let dx = 0;
      let dy = 0;
      if (Math.abs(e.deltaX) > 0) {
        dx = -e.deltaX * speed;
        dy = -e.deltaY * speed;
      } else {
        if (e.shiftKey) {
          dx = -e.deltaY * speed;
        } else {
          dy = -e.deltaY * speed;
        }
      }
      setViewport({
        x: viewport.x + dx,
        y: viewport.y + dy,
        zoom: viewport.zoom
      });
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [getViewport, setViewport]);
  return null;
};
export {
  CanvasWheelController
};
