import { useReactFlow, useViewport } from "@xyflow/react";
import { ZoomInButton } from "./ZoomInButton";
import { ZoomOutButton } from "./ZoomOutButton";
import { ZoomFitButton } from "./ZoomFitButton";
import { ResetZoomButton } from "./ResetZoomButton";
const CanvasZoomWidget = () => {
  const { zoomIn, zoomOut, fitView, setViewport, getViewport } = useReactFlow();
  const { zoom } = useViewport();
  const zoomPercent = Math.round(zoom * 100);
  const handleResetZoom = () => {
    const vp = getViewport();
    setViewport({ x: vp.x, y: vp.y, zoom: 1 }, { duration: 200 });
  };
  return <aside className="absolute bottom-6 right-6 z-20 flex items-center gap-1 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl p-1 shadow-2xl select-none">
      <ZoomOutButton onClick={() => zoomOut({ duration: 150 })} />
      <ResetZoomButton zoomPercent={zoomPercent} onClick={handleResetZoom} />
      <ZoomInButton onClick={() => zoomIn({ duration: 150 })} />
      <div className="w-px h-3.5 bg-zinc-800 mx-0.5" />
      <ZoomFitButton onClick={() => fitView({ padding: 0.2, duration: 250 })} />
    </aside>;
};
export {
  CanvasZoomWidget
};
