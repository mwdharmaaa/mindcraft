const COLOR_PALETTE = [
  "#ffffff",
  // crisp white
  "#f4f4f5",
  // zinc 100
  "#e4e4e7",
  // zinc 200
  "#d4d4d8",
  // zinc 300
  "#a1a1aa",
  // zinc 400
  "#71717a",
  // zinc 500
  "#52525b",
  // zinc 600
  "#3f3f46",
  // zinc 700
  "#27272a"
  // zinc 800
];
const ColorPalettePicker = ({
  currentColor,
  onSelectColor
}) => {
  return <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-zinc-400">Accent Border</label>
      <div className="flex items-center gap-2 flex-wrap">
        {COLOR_PALETTE.map((hex) => <button
    key={hex}
    onClick={() => onSelectColor(hex)}
    className={`w-5 h-5 rounded-full border transition-transform ${currentColor === hex ? "scale-125 border-white shadow-sm ring-2 ring-zinc-500/40" : "border-zinc-700 hover:scale-110"}`}
    style={{ backgroundColor: hex }}
  />)}
      </div>
    </div>;
};
export {
  ColorPalettePicker
};
