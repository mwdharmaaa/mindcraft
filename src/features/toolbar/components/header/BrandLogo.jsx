import { Network } from "lucide-react";
const BrandLogo = () => {
  return <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
        <Network className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-sm tracking-tight text-zinc-100">MindCraft</span>
        <span className="text-[10px] font-mono uppercase text-zinc-400">Story Studio</span>
      </div>
    </div>;
};
export {
  BrandLogo
};
