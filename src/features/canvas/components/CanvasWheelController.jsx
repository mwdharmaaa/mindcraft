import { useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
const CanvasWheelController = () => {
  const { getViewport, setViewport } = useReactFlow();
  useEffect(() => {
    const container = document.querySelector(".react-flow");
    if (!container) return;

    let touchPinch = null;

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
        const isDiscreteWheel = Math.abs(rawDelta) >= 80;
        const PINCH_VELOCITY = 0.12;
        const DISCRETE_STEP = 0.85;
        const normalizedDelta = isDiscreteWheel
          ? Math.sign(rawDelta) * DISCRETE_STEP
          : Math.sign(rawDelta) * Math.min(Math.abs(rawDelta) * PINCH_VELOCITY, 1.25);
        const factor = Math.exp(-normalizedDelta);
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
      const SCROLL_SPEED = 1.5;
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

    const handleTouchStart = (e) => {
      if (e.target?.closest("input, textarea, select, [data-no-wheel]")) {
        return;
      }
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;
        touchPinch = {
          dist,
          midX,
          midY,
          vp: getViewport()
        };
      } else {
        touchPinch = null;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && touchPinch && touchPinch.dist > 5) {
        e.preventDefault();
        e.stopPropagation();

        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const ratio = currentDist / touchPinch.dist;

        const TOUCH_PINCH_EXPONENT = 3.5;
        const factor = Math.pow(ratio, TOUCH_PINCH_EXPONENT);

        const baseVp = touchPinch.vp;
        const nextZoom = Math.min(Math.max(baseVp.zoom * factor, 0.15), 2.5);

        if (Math.abs(nextZoom - baseVp.zoom) < 1e-4) {
          return;
        }

        const rect = container.getBoundingClientRect();
        const cursorX = touchPinch.midX - rect.left;
        const cursorY = touchPinch.midY - rect.top;
        const currentMidX = (t1.clientX + t2.clientX) / 2;
        const currentMidY = (t1.clientY + t2.clientY) / 2;
        const panX = currentMidX - touchPinch.midX;
        const panY = currentMidY - touchPinch.midY;

        const newX = cursorX - (cursorX - baseVp.x) * (nextZoom / baseVp.zoom) + panX;
        const newY = cursorY - (cursorY - baseVp.y) * (nextZoom / baseVp.zoom) + panY;

        setViewport({ x: newX, y: newY, zoom: nextZoom });
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        touchPinch = null;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [getViewport, setViewport]);
  return null;
};
export {
  CanvasWheelController
};
