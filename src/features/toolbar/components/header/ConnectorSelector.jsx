const ConnectorSelector = ({ current, onChange }) => {
  return <div className="flex items-center gap-1 border-r border-zinc-800 pr-2 mr-1">
      {["smoothstep", "bezier", "straight"].map((conn) => <button
    key={conn}
    onClick={() => onChange(conn)}
    className={`px-2.5 py-1 text-xs rounded-lg capitalize transition-all ${current === conn ? "bg-zinc-800 text-zinc-100 border border-zinc-600 font-semibold" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"}`}
  >
          {conn === "smoothstep" ? "Step" : conn}
        </button>)}
    </div>;
};
export {
  ConnectorSelector
};
