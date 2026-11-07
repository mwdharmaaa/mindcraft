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
      if (e.ctrlKey || e.metaKey || e.altKey) {
        const rawDelta = e.deltaMode === 1 ? e.deltaY * 18 : e.deltaMode === 2 ? e.deltaY * 50 : e.deltaY;
        const isDiscreteWheel = Math.abs(rawDelta) >= 45;
        const zoomVelocity = 1;
        const normalizedDelta = isDiscreteWheel
          ? Math.sign(rawDelta) * 0.45
          : Math.sign(rawDelta) * Math.min(Math.abs(rawDelta) / 40, 0.75);
        const factor = Math.exp(-normalizedDelta * zoomVelocity);
        const nextZoom = Math.min(Math.max(viewport.zoom * factor, 0.15), 2.5);

        if (Math.abs(nextZoom - viewport.zoom) < 1e-4) {
          return;
        }

        const rect = container.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        const newX = cursorX - (cursorX - viewport.x) * (nextZoom / viewport.zoom);
        const newY = cursorY - (cursorY - viewport.y) * (nextZoom / viewport.zoom);

        setViewport({ x: newX, y: newY, zoom: nextZoom });
        return;
      }
      const SCROLL_SPEED = 1.15;
      let dx = 0;
      let dy = 0;
      if (Math.abs(e.deltaX) > 0) {
        dx = -e.deltaX * SCROLL_SPEED;
        dy = -e.deltaY * SCROLL_SPEED;
      } else {
        if (e.shiftKey) {
          dx = -e.deltaY * SCROLL_SPEED;
        } else {
          dy = -e.deltaY * SCROLL_SPEED;
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
